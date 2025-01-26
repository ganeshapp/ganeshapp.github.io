---
title: Pigeonhole Principle
date: 2024-11-24
---
> If you have more pigeons than pigeonholes, at least one pigeonhole must contain more than one pigeon.

Though this is a simple principle, it is very useful in solving complex problems.

## Examples

### 1\. When 5 points are placed on a sphere, at least one hemisphere must contain at least 4 points

2 points in a sphere define a hemisphere. The rest of the 3 points must go to one of the hemispheres. There are three points and two hemispheres, so at least one hemisphere must contain at least 2 points. And therefore, at least one hemisphere must contain at least 4 points.

### 2\. If there is a sequence of 101 integers, and their sum is 300, then there must be a subsequence of n consecutive integers that sum to 200

Let the sequence be $a\_1, a\_2, a\_3, \\ldots, a\_{101}$.

Let the subsequence $s\_k$ be the set of $k$ consecutive integers starting from $a\_1$.

$s\_1 = a\_1$

$s\_2 = a\_1 + a\_2$

$s\_3 = a\_1 + a\_2 + a\_3$

and so on... $s\_{101} = a\_1 + a\_2 + \\ldots + a\_{101}$

A total of 101 such subsequences are possible.

The last two digits of the sum of each of these subsequences are one of the following: 00, 01, 02, ..., 99.

There are 100 possible values for the last two digits.

But there are 101 subsequences.

By the pigeonhole principle, at least two of these subsequences have a sum that must have the same last two digits.

Let $s\_i$ and $s\_j$ be two such subsequences.

$s\_i = a\_1 + a\_2 + \\ldots + a\_i$

$s\_j = a\_1 + a\_2 + \\ldots + a\_j$

$s\_j - s\_i = a\_{i+1} + a\_{i+2} + \\ldots + a\_j$

$s\_j - s\_i$ must be a multiple of 100.

Therefore, the subsequence $a\_{i+1} + a\_{i+2} + \\ldots + a\_j$ must sum to 100 or 200.

Now if the sum is 200, then the subsequence is the answer.

If the sum is 100, then the subsequence $a\_1 + a\_2 + \\ldots + a\_i$ must sum to 100.

### 3\. In a group of 6 people, at least two people have shaken hands with the same number of others

Each person can shake hands with 0,1,2,3,4,5 people. However, if one person shakes hands with 0 people, no one can shake hands with 5 people (handshakes are mutual).

This reduces the possible handshake counts to {0,1,2,3,4} or {1,2,3,4,5} — 5 values.

With 6 people and 5 possible values, at least two must have the same handshake count by the Pigeonhole Principle.

### 4\. For a set of n+1 integers, there must be two integers that are divisible by n

Consider the $n+1$ integers modulo $n$.

There are $n$ possible remainders: $0, 1, 2, \\ldots, n-1$.

By the pigeonhole principle, at least two of the $n+1$ integers must have the same remainder when divided by $n$.

Let these two integers be $a$ and $b$.

$(a - b) \\mod n = a \\mod n - b \\mod n = 0$

Their difference must be divisible by $n$.

### 5\. If there are 5 points in a square with side length 2, then at least two points are no more than $\\sqrt{2}$ apart

Divide the square into 4 smaller squares with side length 1.

Each small square has side length 1, so the diagonal is $\\sqrt{2}$.

By the pigeonhole principle, at least two of the five points must be in the same small square.

Therefore, the distance between these two points is at most $\\sqrt{2}$.

### 6\. In a group of 6 people, there must be three people who know each other or three people who do not know each other

Represent the group as a graph where vertices are people and edges are "friendship." Non-edges represent strangers.

Any person has 5 connections (friends or strangers). By the Pigeonhole Principle, at least 3 connections are either all friendships or all strangers.

Focus on these 3 connections: If they are friends, they form a triangle of friends. If strangers, the same argument applies.

## Notes

The difficulty is not in understanding the principle, which is quite simple, but in applying it to a given problem. Setting up the "pigeon" and the "pigeonholes" is the hard part. And even identifying if a problem can be solved using the pigeonhole principle is not always obvious.