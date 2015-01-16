On adding transmission from any person
====

I want to allow stochastic influence from outside the local group.
(cf. Peyton Young's model.)  To start with I'm considering one-way
transmission.

How should this be parameterized?

There are two dimensions:

1. How many people get transmitted to?

2. How many people transmit to someone who's receiving?

If these are percentages, then the prob of something occurring doesn't
change with as pop size N changes.

If these are numbers of individuals, then it does.

The first dimension, number transmitted to, should be a probability that
doesn't change with N.

The second dimension, however, corresponds to an effect size:  Larger
values could overwhelm or be swamped by the local network communication.
And this effect size *would* change with N, if we use a
probability/percentage, since we're not also scaling the structure of
the network.  So (2) should be measured in absolute number of transmitters, not
percentage of the population.

Note that these considerations make two-way transmission problematic.
On the other hand, since I'm treating the first dimension as random,
there will be transmissions two every part of the network.  Thus, at
least if the probability is high enough, any local cluster will have
both receiver and transmitter members.  Since local clusters normally
stabilize to similar values, the effect is like two-way transmission,
at least when imposed after the network has stabilized.
