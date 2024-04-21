---
sidebar_position: 2
title: Conflicts 😖
---

> I hate them <br/> 
> You hate them <br/>
> but its good to know how to resolve them. 

:::note

Please always use some tools (*like VSCode, jetBrains's IDEs*) to resolve git conflicts. It is much easier to resolve them seeing them visually.

I will show manually so that you can understand the tools.
:::

Conflict arises when two different change occurs in the same place in git repo.


<Problem>
Create a conflict with `remote-git` and `local-git`. To do this, please create a commit in both `local-git` and `remote-git` editing the same location within a file.

To accomplish this

1. Use master in both repos
2. change `remote-git` `README.md` first line to A + 1 and commit
3. change `local-git` `README.md` first line to A + 2 and commit
4. `pull` `remote-git` into `local-git` to create the conflict

<Solution>
You can open git repo in VSCode using `code .`. then change the files there

```bash
# remote-git

git checkout master
notepad README.md
git add .
git commit -m "remote A+1"


# local-git
git checkout master
notepad README.md
git add .
git commit -m "local A+2"


git pull
```

</Solution>
</Problem>


You can resolve conflicts by choosing any combination of change.

:::note

if you resolved a conflict by taking your local changes, and if you do `git status` there will be nothing, as we have taken our own changes, but is nothing changed, but we still have to perform an empty merge commit.

:::


:::note

After the conflict has been resolved git will make a new commit for resolving conflict because it is also a change to git repo state.

And with this if you don't push your changes to `remote`, and someone change remote again, then you will have perform each time an extra merge commit.

:::


:::info

conflicts can also occur when you are trying to merge data from 1 branch to another, and they will also be resolved similarly.

:::


# Conflicts with rebase

Remember `rebase` is fundamentally different from `merge`. `rebase` actually move our changes to the tip of the branch.


<Problem>
Lets create another conflict but resolve it while using `rebase` instead of `merge`.

Steps:

1. create change in `remote-git` and in `README.md` change `A + 1` -> `A + 3`.
2. create another change in `bar.md` **LAST LINE** in `remote-git`
3. create change in `local-git` and in `README.md` change `A + 1` -> `A + 4`.
4. create another change in `bar.md` **FIRST LINE** in `local-git`
5. rebase `local-git`'s **master** with `remote-git`'s and create the conflict

<Solution>

1. remote git
```bash
git checkout master

notepad README.md
notepad bar.md

git add .
git commit -m "A+3"

```
2. local git
```bash
git checkout master

notepad README.md
notepad bar.md

git add .
git commit -m "A+3"

```
3. rebase
```bash
git pull origin master --rebase
```

</Solution>
</Problem>


When we do this, eventually we will hit on a conflict like this:

```bash
> remote: Enumerating objects: 7, done.
remote: Counting objects: 100% (7/7), done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 4 (delta 0), reused 0 (delta 0), pack-reused 0
Unpacking objects: 100% (4/4), 337 bytes | 21.00 KiB/s, done.
From ..\remote-git\
 * branch            master     -> FETCH_HEAD
   348223b..9cf1a20  master     -> origin/master
Auto-merging README.md
CONFLICT (content): Merge conflict in README.md
Auto-merging bar.md
error: could not apply 1dccd35... A+4
hint: Resolve all conflicts manually, mark them as resolved with
hint: "git add/rm <conflicted_files>", then run "git rebase --continue".
hint: You can instead skip this commit: run "git rebase --skip".
hint: To abort and get back to the state before "git rebase", run "git rebase --abort".
Could not apply 1dccd35... A+4
```


see here only conflict occurs in `README.md` while rebase succeeded for `bar.md`.


:::note

1. We can abort our rebase with `git rebase --abort` to get back to the state before, much like `git merge --abort`.

2. You can instead skip this commit, run `git rebase --skip`, while performing rebase.

3. After we resolved all the conflicts, we can perform `git rebase --continue`.

:::



Now lets resolve the conflict.

We will choose `remote-git` changes that means `A+3` will remain after resolving conflict. 


<Footgun>
Sometime we are in a habit to commit after a resolving a conflict, but in this case we are still performing `rebase`, which is playing our commits one at time.
In such case you can do 
```bash
git reset --soft HEAD~1 
```
and then continue with 

```bash
git rebase --continue
```
</Footgun>


So why we did all this, lets check `git log` on local

```bash
git log --graph --oneline
```

See we do not have merge commit, with diverging branches. This is the beauty of `rebase` we can keep our history straight / clean, because it is easier to debug when something bad happens.

# Problem with rebase

We loose change while performing rebase.
like in above there is nowhere that `A+4` change exist in our history. (😏 except in `reflog`)

So this is some of the dangers of rebase. Basically we replayed our commits one by one in such a way that we removed our / theirs changes from them.



<Problem>

Lets try create the same issue except this time lets accept `local-git` change.

1. A + 5 in `remote-git`.
2. A + 6 in `local-git`.
3. `git pull origin trunk --rebase` in `local-git` to cause the conflict.
4. accept `A + 6` change and `git rebase --continue`.
5. check out history to see `A + 6` commit.
6. Don't Push the changes.

<Solution>

1. remote git
```bash
git checkout master

notepad README.md
git add .
git commit -m "A+3"

```
2. local git
```bash
git checkout master

notepad README.md
git add .
git commit -m "A+3"

```
3. rebase
```bash
git pull origin master --rebase
```

4. open VSCode to resolve conflict and accept `local-git changes`.
5. Check logs
</Solution>
</Problem>


<Problem>
Create a change in `remote-git` and pull again.

1. Add a NewLine below `A + 6` in `remote-git` and commit.
2. `rebase` pull `remote-git` and cause the conflict
3. **DO NOT RESOLVE THE CONFLICT**
4. See the conflict

<Solution>

```bash
git checkout master

notepad README.md

```

See actually how rebase works it is trying to play our commits one at a time, and this happens because we have not pushed the changes.
</Solution>
</Problem>


:::note

Rebase works by replaying the commits one at a time. Therefore if we have our change from a conflict and then we replay the changes we will `reconflicts` on the same change again and again.

Does that mean rebase sucks? Well `no`, it keeps your history very clean, but does that mean rebase can be annoying? `Yes`.

:::


:::info

To solve this issue we have `rerere`

`rerere` stands for `REuse REcorded REsolution`. Or in other words, git will automagically remember how you handled a specific conflict and will just replay your decision the next time you run into it.

to enable this we have to do

```bash
git config rerere.enabled true
```

:::


# Good reason to use rebase with `SQUASHME`

We can do a lot with rebase but I have only done rebase to `squash` my multiple commits into one.

You can 
- drop commits while rebasing
- change commits messages
- ...
  

<Problem>
setup your `local-git` with 3 simple git commits.

1. add 1 to end of read me. commit -m "added 1 ate"
2. add 2 to end of read me. commit -m "added 2 ate"
3. add 3 to end of read me. commit -m "added 3 ate"
   

<Solution>

```bash
echo "1" >> README.md
git add .
git commit -m "added 1 ate"

echo "2" >> README.md
git add .
git commit -m "added 2 ate"

echo "3" >> README.md
git add .
git commit -m "added 3 ate"


git log --oneline --graph
```

</Solution>
</Problem>


Now we will use Interactive mode of rebasing and try to squash this merges into 1.

```bash

git rebase -i <commitish_value>

```

because of interactive mode, we get to choose how to replay our commits.


By this we can do anything with our commits.