---
sidebar_position: 3
title: HEAD 💀
---


# HEAD

`HEAD` is just a special pointer which points to current state (commit) of our repo.

# Reflog

`reflog` is a special `log` which only stores the moving history of `HEAD` pointer.

Why it is useful ?

<Problem>
This will be an interesting set of tasks to do, but can be quite useful in understanding reflog.


1. create a new branch off of `master`, call it `baz`.
2. add one commit to `baz`. Do it in a new file `baz.md`
3. switch back to `master` and delete `baz` (git branch -D baz from earlier)
4. can you bring back from the dead the commit sha of `baz`?


<Solution>
Yes we can bring back foo, because when some thing is tracked by git even it is deleted at current state of time, we still have commit history which stores the entirety of data.

```bash

git checkout master

git checkout -b baz

echo "baz" >> baz.md
git add .
git commit -m "bazz"

git checkout master
git branch -D baz

```

now you can use `reflog` to see `HEAD`'s previous location, as all the history of `baz` is removed from log.

```bash
> git reflog
> 374f152 (HEAD -> master, bar-2) HEAD@{0}: checkout: moving from baz to master
a339c5b HEAD@{1}: commit: bazz change
374f152 (HEAD -> master, bar-2) HEAD@{2}: checkout: moving from master to baz
...
```

now we can checkout with `SHA` or there are special syntax for `HEAD` pointer to move.
like here we can use HEAD@{1} to move `HEAD` to, 1 step before where `HEAD` was previously. 

```bash
git checkout "HEAD@{1}"
git checkout -b baz
```
</Solution>
</Problem>



# Moving HEAD
We can also move `HEAD` relative to its position, to walk back commits.
We use a special syntax with `~n` to give relative position of commits wrt to current commit.


```bash

git checkout HEAD~3

```

# Reset

We can reset current state of repo to some previous state.

there are 2 options to reset to a previous state

```bash

git reset --hard <SHA>

# or

git reset --soft <SHA>

```

`--hard`: will reset your repo state to previous commit, and also changes will be lost. ("😏 except from `reflog`")

`--soft`: will reset your repo state to previous commit, but changes will reflect back into tracked stage.


# Revert

Revert is like anti-commit of `<provided_commit>`, basically it will not change any history but will add an anti-change which will remove the changes of the `<provided_commit>`.

```bash

git revert <SHA>

```

# cherry-pick 🍒
We can bring only one commit from one branch to another branch ny cherry picking that commit.

```bash

git cherry-pick <commit SHA>

```

:::info

cherry-pick is one of the most useful command of git, because there will certainly be cases where a change has such an bad divergence and the merge conflict is so bad, that only thing is to hand move (cherry-pick) the commits across branches.

:::






