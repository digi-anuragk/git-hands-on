---
sidebar_position: 1
title: Remote
---


## Remote 🤔
Often we need code changes that have been created by our fellow mates. But how do we get their changes into our repo? Or how do we push our changes to someone else repo?

**It doesn't have to be `remote`...**
Often we think of `remote` repos as github or gitlab, but it doesn't have to be that way.
If you have never used git, maybe `remote` is an odd term.

A `remote` is simply a ***copy*** of the repo somewhere else.

<Problem>
Create a new repo, `remote-git`. Lets initialize it as an empty git repo using `git init`, and create a `temp-move` branch and checkout to it.
<Solution>
    ```bash

    mkdir remote-git
    cd remote-git

    git init
    git checkout -b temp-move

    ```
</Solution>
</Problem>


## Origin

Now to set a remote location as backup copy for our repo, we use below command

```bash
git remote add <remote_name> <remote_url>
```

<Problem>
Lets add `remote-git` as a `remote` storage for our `local-git`. `remote-git` will behave as github for us.
<Solution>
```bash
git remote add origin ..\remote-git
```
</Solution>
</Problem>


:::info

Naming convention for `remote` :

1. `origin` : This is the source of truth repo, meaning main git backup from where all other will also `clone` this repo.
2. `upstream` : This is second source of your repo, meaning if you `pull` changes from some other repo, but its in not your main backup repo.
  
:::


Once you have added `remote`, you can check your remote using

```bash
git remote -v
```

this will show all `push` and `pull` urls.


## Push

Now we have our `remote` set up, and we also have changes in our `local-git`. Lets backup (`push`) these changes to our remote storage (`remote-git`).

```bash
git push
```

<Problem>
Lets try to `push` our changes from `local-git` to `remote-git`.
<Solution>
```bash
git push
```
</Solution>
</Problem>



:::danger[❌ ERROR ❌]

But it wont work why because, in order to track changes from both `local-git` and `remote-git`, our local git must have a another branch which is hidden and which will `track` to changes of our `remote` branch. 

Why we need another branch, because someone else might `push` changes to our remote.

:::



## Set tracking Info

tracking info is set for each branch individually. Now setting tracking will have two flavours depending wether we have a `remote` branch available or not

1. \# Case 1: When remote tracking branch is not available => this condition arises when we create a fresh brach on local but it is not present in remote.

In such case we have to manually set tracking info.

 - first lets check all branched present in our local repo .
```bash
git branch -a
```
 - now lets add tracking info

```bash
git push --set-upstream-to origin master

# or

git push -u origin master

```

2. \# Case 2: When remote tracking branch is available => in that case git will automatically set the tracking branch for our local branch.


:::info

we only have to set tracking information only once

:::



## Fetch

`fetch` command is used to fetch all remote git state on our local repo.

```bash
git fetch
```

<Problem>
Lets add some remote changes in our `remote-git`, and lets try to `fetch` the remote-state.
<Solution>

**inside `remote-git`** :
```bash
echo "remote change" >> remote.md
git add .
git commit -m "remote changes"
```

**inside `local-git`** :
```bash
git fetch
```
</Solution>
</Problem>


lets see all the changes happened when we `fetch` the git state.

1. first check all the new branched that are added

```bash
git branch -avv
```

2. Lets see the difference our `local state` with `remote state`

```bash
git diff origin/master
```


## Merge

Now we have remote changes, how to merge them in our local repo.
We can use 

```bash
git merge
```


## Pull

Well pull is a handy command which will perform 2 operation

1. `git fetch`
2. `git merge`

nothing else


:::info

you can also perform `rebase` while performing `pull` operation.

```bash
git pull --rebase
```

:::

<Problem>
Create a new branch `ft1` in `remote-git`, and add a change `ft1 remote change` to `ft1.md`.
After that pull these changes from `local-git`.
    
<Solution>

        ```bash

        ## remote-git
        git checkout -b ft1

        echo "ft1 remote change" >> ft1.md
        git add .
        git commit -m "ft1 remote change"



        ## local-git

        git fetch
        git branch -avv
        git merge

        ```
</Solution>
</Problem>




Wait, why does is says `Already up to date.`, we just made changes in remote.

Because we just discuss, that each branch have it own tracking branch => which means `git push` or `git merge` or `git pull` works on branch basis.

so we have to make another branch with same name as on `remote`. But wait, we already have a remote tracking branch for `ft1`, which means we do not have to manually made a new branch, we can directly checkout to `ft1` even it is not present, because git will **AUTOMAGICALLY** will create us new branch name `ft1` and will sets in tracking info

<Problem>
Checkout `ft1` is local-git.
<Solution>
    
```bash
git checkout -b ft1

git branch -avv

```

</Solution>
</Problem>


Ok, now we know about, but what about if someone else make some changes and pushed on `remote` and we also make changes in some place on same file. Then what happens ?



