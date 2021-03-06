NoteUpdateNotes.md
====

## transmission in popco

In popco, nodes are updated like this:

	decayed activation +

	(max - activation) *
	(sum of positive activations across positive links) +

	(activation - min) * 
	(sum of positive activations across negative links)

Note that if activation is positive, then `max - activation` is
between 0 and 1.  But if activation is negative, this in effect adds a
positive value to 1, so the result is a value between 1 and 2.  So the
scaling effect is a linear function of activation that ranges from 0
to 2.

Similarly, if activation is negative, then (activation - min) is
activation + |min|, i.e. + 1.  So this is in effect 1 - |activation|,
and it will range from 0 to 1.  But when activation is positive, we
are adding 1 to it, so the result is between 1 and 2.  So again, this
is a linear function of activation, ranging from 0 to 2.  (However, the
signals coming (from positive nodes) over the negative links are
negative, so the overall effect here is negative.)

## "popco tran" in NetLogo

What happens in "popco tran" my NetLogo network tran models is
somewhat analogous.  

Links have no weights, and negative activations are not ignored as in
popco networks.  However, if the sender's activation is positive (sort
of analogous to a positive link), the message sent is scaled by the
distance of the receiver's activation from the max, *but only if this is
greater than 1*.  

(Why did I do this?  Well it's a bit more stabilizing, as I
recall--**see below**.  I made the change early on, in
NetworkExperiment1.nlogo in the original popco repo, at history tag
e2a52af [e2a52af1304f60c2eca2946231eca1760d9b5dd8].  Neither the
commit message or comments in the source code explains the
choice--maybe because I was just experimenting at that point. 
Now--Jan 2015--I've got a chooser in the UI that can try out both
options.)

If the sender's activation is negative, then the negative message sent
is scaled by the receiver's activation minus the min, i.e. plus it's
abs value.  But again, only if this ends up being greater than 1.
(sort of analogous to a negative link.)

So, *without* the clipping to 1, the scaling factor works like this:

(1) if sender activn < 0, return distance of receiver activn from min

This result ranges from 0 to 2.  When the receiver activn is positive
(far from min), the scaling factor is near 2.  When receiver activn is
negative, the scaling factor is near zero (or 1, if I use the
traditional clipping that I'd added).

(2) if sender activn > 0, return distance of receiver activn from max

This result ranges from 0 to 2.  When the receiver activn is negative
(far from max), the scaling factor is near 2.  When receiver activn is
positive, the scaling factor is near zero (or 1, if I use the
traditional clipping that I'd added).

The incoming increment is often one of two fixed quantities (usually
0.05 or -0.05), unless the stddev is set to something other than 0.  The
scaling factor is always non-negative, from 0 to 2.  It is strong when
the receiver activn is far from the extreme in the direction in which
the incoming increment is pushing, and weak when the receiver activn is
near the extreme in the direction in which the message is pushing.

e.g. if the receiver activn is 0.95, and the incoming increment is 0.05,
a small fraction of that will be added.  If the increment is
-0.05, though, close to 0.10 will be subtracted.

#### On clipping min distance to 1:

If there's clippping, because `min-dist-from-extremum` is set to
something other than 0 (e.g. set it to 1, as in the old, fixed version),
the effect is that the impact of the incoming increment, when the
receiver activn is near an extreme and the increment is pushing toward
that extreme, is that the effect of the increment is undiminished by
closeness to the extreme.

e.g. with `min-dist-from-extremum` = 0, if a incoming increment is
pushing toward the extreme, as the receiver activn gets closer to that
extreme, the impact of the increment decreases linearly.  But with
`min-dist-from-extremum` = 1, once the receiver activn passes 0 in the
direction of push, the impact of the increment is never diminished.  it
remains at 1 * incoming increment.  The effect is that convergence to
extrema is faster.

Setting `min-dist-from-extremum` to 1 (old method) rather than 0 also
makes the borders between black and white regions a bit cleaner.
I think that this is probably why I originally restricted "distances"
from extrema to being at least 1.

The reason that the borders are cleaner is that once a node is on the
way to converging to an extremum, it will get there, as will its
neighbors on its side of the border.  So the mutual support between them
is stronger.

Whereas when `min-dist-from-extremum` is 0, neighbors that share the same
extreme value have less impact on each other, so there's less mutual
support.  Thus it's easier for those on the other side of the border
to pull those on this side away from the extreme.  

That's my current reasoning, anyway.

(Note that messier borders means a greater chance of an unlikely
invasion.)


## A bug?

My conception of "popco" transmission in CultranDejanet and its
predecessors and successors is that the default tran combines all
inputs to a node.  Upon studying my code more carefully (in
SuccessBias1.nlogo), this appears to be incorrect.

`network-transmit-cultvars` `ask`s all persons--effectively in
parallel--to try transmit to each of their link-neighbors.  So far, so
good.  If the transmitting person decides to transmit, then
`receive-cultvar` is called on the neighbor.  However, it appears that
*from this point on*, there is not parallel update.  It's just
first-come, first served.  

This is so even though I use a current `activation` variable and a
`next-activation` variable that temporarily holds the next activation.
Yes, all of the `activations` are replaced by `next-activation` at the
same time.
However, if a receiving node has more than one neighbor that asks it
to receive cultvars, the updated activn in `next-activation` from one
transmission will simply get overwritten by the communication from
other neighbors.  This communication may be a scaled 0.05 or a scaled
-0.05, but all communications are one of those possibilities, and only
one of them counts.  

If this is right, then the fact that "popco" tran generates clusters
of similarity and difference is simply due to the fact that the
decision to transmit is stochastic: If you have more neighbors, you
have more neighbors flipping a coin about whether to transmit to you.
If fewer of them flip the coin, then there is a greater chance that no
one will communicate with you.  If more do, then there's a greater
chance that you will receive a communication.  Moreover, if your
neighbors all have the same extreme activation, then they're likely to
say something.  One of them will probably succeed.  Further, if
you also have, say, one neighbor with the opposite extreme
activation, it will sometimes, just by chance, get through to
you--sometimes it will win the per-tick lottery to talk to you.
Its communication will have the same strength of effect as any of
the other neighbors who agree with you would have had.  (See
PopcoTransmission.{pdf,tex}, which clarifies that the effect is
not, as I'd thought, greater when pushing toward the opposite
extreme.)  However, the effect of this opposition neighbor
getting through to you is likely to be undone in the next tick,
since most of your neighbors disagree with it.

*Is this correct??*
