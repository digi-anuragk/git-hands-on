---
sidebar_position: 2
title: Merge And Rebase
---

<Problem>
    Lets start off by creating some more commits and adding them to `master`. This way our branches will diverge,  meaning they have commits that are unique in both and have a common ancestor, `A`.

    Please add `D` and `E` in the README.md.

    Desired State:

    ```mermaid
    %%{init:  {'theme': 'base', 'gitGraph': {'mainBranchName': 'master'}} }%%
        gitGraph
        commit id: "A"
        branch foo
        commit id: "B"
        commit id: "C"
        checkout master
        commit id: "D"
        commit id: "E"

    ```

<Solution>

    ```bash
    git checkout master

    echo "D" >> README.md
    git add .
    git commit -m "D"

    echo "E" >> README.md
    git add .
    git commit -m "E"

    git log --oneline --graph
    git log --oneline --graph foo

    ```
</Solution>
</Problem>


## Git Merge And Rebase

:::info[Remember]

A `commit` is a point in time with a specific state of the entire code base.

:::

We have work done, but its on another branch. We need to get it back into our main branch, `master` but how?

There really is only one strategy to `merge` code from one branch to another, but depending on the history,  different outcomes can happen. `rebase` can help put a branch into a `clean` state.


## What is Merge


A `merge` is attempt to combine two histories together that have diverged (branched) at some point in the past. There is a common `commit` point between the two, this is referred to as the Lowest Common Ancestor (`LCA` which is also referred as `"merge base"` often in the docs).


To put it simply, the first common parent, is the `LCA`.
git then merges the sets of commits onto the merge base and **`creates a new commit at the tip of the branch`** that is being merged on with all the changes combined into one commit.

## How to Merge

Merging is quite simple.
Merging will merge changes from `source` to `target`
The branch you are currently on is the `target` branch and the branch you name in `<branch_name>` will be the source branch.

```bash
git merge <branch_name>
```


<Problem>
    Given the following state, merge `foo` onto `master`. Since we want to keep foo and `master` in its current state for other problems later in this lesson. Please start by branching off of `master`. I named mine `master-foo`.

    Finally, when you are done use git log to see the resulting state of `master-foo`.

    Git state should be
    ```mermaid
    %%{init: { 'logLevel': 'debug', 'theme': 'base', 'gitGraph': {'showBranches': true, 'showCommitLabel':true,'mainBranchName': 'master'}} }%%
        gitGraph
        commit id: "A"
        branch foo
        commit id: "B"
        commit id: "C"
        checkout master
        commit id: "D"
        commit id: "E"
        branch master-foo
        merge foo id: "merger commit"
    ````

<Solution>
    ```bash
    git checkout master
    git checkout -b master-foo

    git log --graph --oneline

    git merge foo
    ```

    At this point you will be presented with a some editor to add an commit message. If you do not want to change it, you can simply close the editor.

    Now can use log to see what happens after merge.

    ```bash
    git log --graph --oneline
    git log --graph --oneline --parents
    ```
</Solution>
</Problem>


You can see merge commit have 3 parents because of how 3-way merge happens (ORT is enhanced version of 3-way merge algorithm)



<Problem>
    1. Create the following git setup. (not full graph). **Make changes in `bar.md`**
    ```mermaid
    %%{init: { 'logLevel': 'debug', 'theme': 'base', 'gitGraph': {'showBranches': true, 'showCommitLabel':true,'mainBranchName': 'master'}} }%%
        gitGraph
        commit id: "A"
        commit id: "D"
        commit id: "E"
        branch bar
        checkout bar
        commit id: "X"
        commit id: "Y"
    ````
    2. Now try to merge `bar` onto `master`
<Solution>
    ```bash
    git checkout master
    git checkout -b bar

    echo "X" >> bar.md
    git add .
    git commit -m "X"

    echo "Y" >> bar.md
    git add .
    git commit -m "Y"

    git log --oneline --graph


    git checkout master

    git merge bar
    git log --oneline --graph
    ```
</Solution>
</Problem>

Wait here there are no new merge commit. Why ??

Because of linear history, as there is no need add an extra commit. We can just Fast-Forward (`FF`) our pointer to latest commit. 

<Footgun>
What will happen if we have some untracked changes in repo, and we checkout to some other branch and we push the changes❓

What about even if the changes are tracked❓
</Footgun>


## Evil Merge

> an `evil merge` is something that makes changes that came from neither
side and aren't actually resolving a conflict.
>
> — Linus Torvalds (creator of Git and Linux)


It basically means, do not add extra things while merging because this extra change will not be  present in any history.

example:

1. initial state
   ```js
    let x = 3;
    let y = 4;
   ```

2. Change From Remote A
    ```js
    let x = 3;
    let y = 4;
    x++
   ```
3. Change From Remote B
    ```js
    let x = 3;
    let y = 4;
    y--
   ```
4. But after merging somehow we git this
 ```js
    let x = 3+1000; // <-- evil merge
    let y = 4;
    x++
    y--
   ```


Our merging algorithm allow this but please do not do this, it is strictly prohibited in many orgs.


## Rebase

Rebasing often gets a bad wrap. Part of this is because people don't really know why or when to use `rebase` and will end up using it incorrectly and thus yelling on the twitters that it "ruins their entire life.".

with the following setup
```mermaid
%%{init: { 'logLevel': 'debug', 'theme': 'base', 'gitGraph': {'showBranches': true, 'showCommitLabel':true,'mainBranchName': 'master'}} }%%
    gitGraph
    commit id: "A"
    branch foo
    checkout foo
    commit id: "B"
    commit id: "C"
    checkout master
    commit id: "D"
    commit id: "E"
    commit id: "X"
    commit id: "Y"
    
````

We can demonstrate the power of `rebase`. What `rebase` will do is update `foo` to having base `Y` instead of `A`.

```mermaid
%%{init: { 'logLevel': 'debug', 'theme': 'base', 'gitGraph': {'showBranches': true, 'showCommitLabel':true,'mainBranchName': 'master'}} }%%
    gitGraph
    commit id: "A"
    commit id: "D"
    commit id: "E"
    commit id: "X"
    commit id: "Y"
    branch foo
    checkout foo
    commit id: "B"
    commit id: "C"
```   
    
But why do we need it ?

`rebase` helps in take new changes committed to the branch from where we have branched. And because of this now we can do `fast-forward merge`.

### What rebase does is
The basic steps of rebase is the following:

1. execute git rebase `<targetbranch>`. I will refer to the current branch as `<currentbranch>` later on
2. checkout the `<targetbranch>`.
3. play one commit at a time from `<currentbranch>`
4. once finished will update `<currentbranch>` to the current commit sha

Pros: 
> it make history clean because there is no merging and thus every merge is `Fast-Forward` merge

Cons: 
> it changes the history of a branch. That means that if you already had `foo` on a remote git, you would have to `force push` it to the `remote` again to rewrite history there as well.


:::tip

**NEVER CHANGE HISTORY OF A PUBLIC BRANCH**. In other words, don't ever change history of `master`.

**But for your own personal branch ?**
I don't think it matters and i think having a nice clean history can be very beneficial if you use git to search for changes through time.

:::