NoteUpdateNotes.md
====

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


What happens in "popco tran" my NetLogo network tran models is
somewhat analogous.  

Links have no weights, and negative activations are not ignored as in
popco networks.  However, if the sender's activation is positive (sort
of analogous to a positive link), the message sent is scaled by the
distance of the receiver's activation from the max, *but only if this is
greater than 1*.  (Why did I do this?  Well it's a bit more stabilizing,
as I recall.  I made the change early on, in NetworkExperiment1.nlogo in
the original popco repo, at history tag e2a52af
[e2a52af1304f60c2eca2946231eca1760d9b5dd8].  Neither the commit message
or comments in the source code explains the choice--maybe because I was
just experimenting at that point.)

If the sender's activation is negative, then the negative message sent
is scaled by the receiver's activation minus the min, i.e. plus it's
abs value.  But again, only if this ends up being greater than 1.
(sort of analogous to a negative link)
