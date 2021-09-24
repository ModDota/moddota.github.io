---
title: Setting Up Your Addon For Collaboration
author: Perry
---

Talking to dota 2 mod developers, or just software developers in general, you will often hear the words 'repositories', 'version control' and 'git'. The reason these are such popular topics is that version control is a very important topic within software development, and if you are working on a piece of software you SHOULD use it. In this article, I will try to clarify firstly what version control is, why you would want to use it, and how I have personaly set it up for dota 2. If you read it all the way to the end I might even give you some shameful stories about how I learnt most of this through trial and error.

# Table of contents
* [What is version control](#what-is-version-control)
* [Why you should use version control](#why-you-should-use-version-control)
* [Git](#git)
* [How to use Git](#how-to-use-git)
* [Remotes](#remotes)
* [Git clients](#git-clients)
* [How to set up a dota 2 mod repository](#how-to-set-up-a-dota-2-mod-repository)
  * [How to make your dota 2 symlinks](#how-to-make-your-dota-2-symlinks)

## What is version control

The name already gives it away, but version control is a method to control.. well, your versions. A more useful description would be that version control is a way of tracking different versions and stages of development in your software. The term repository is used to describe a project that is managed by some kind of version control. You basically have a system in place that tracks any changes and makes sure that everyone working on the software can work on the same version of this software simultaneously. This usually means that you have a 'remote' server that has all files, and every time you or somebody else makes a change, this remote knows this and can distribute this version to other people working on the software. There are multiple methods to do version control, popular ones include Git, SVN and Mercurial. This article will focus on Git as it is in my opinion the most convenient method.

## Why you should use version control

There are a lot of reasons so use version control, I will list the ones that I personally think are the most important:
* **Working together**: <br/> Version control allows multiple people to work on the same files without overriding eachother's changes. Git just looks at individual line changes, and when two people happen to edit the same line it will automatically detect the clash and ask for it to be resolved.
* **Looking back**: <br /> Using version control you save different versions of your software. This means that at a later point in time you can always look back at a previous version. This means you can go back to an older version if something is seriously messed up, or you can just look at the code you had previously to compare it with your current code.
* **Back-ups**: <br /> Like stated before, most version control systems have a remove that keeps track of all the changes in the software. This means that if your hard-drive were to crash, you could always get the software from your remove like nothing happened.

I would also like to address some (wrong) misconceptions about why you would _not_ want to use version control:

* _"This software is so simple it does not need version control"_: <br /> I have to admit that in some cases this is true, generally if you only plan on working on the code for one or two days you can get away with it. However, if you plan on working on software for longer than two days you should use version control to keep track of your development process. Just the back-up function of version control makes it worth-while.
* _"I am the only person working on this code"_: <br /> Trust me, this is probably the worst argument for not using version control. Like in the point above the back-up function alone makes it worth-while to use it. Furthermore the division of your software into different versions is very useful for the development process.

## Git

Like mentioned before, this article will focus on the use of Git. So what is Git? Git is a method of version control where all collaborators have their own repository on their machine. Whenever they commit a change, only their repository is updated. Once the developer is happy with what he has he can push all changes he has made to the remote, so other collaborators can pull them. Git also allows for different branches, meaning that you can have two branches with different versions of your software active at the same time, and changes by developers are only applied to one branch. Branches can also be merged so that changes made in one branch are also applied in the other branch. A common example of this is software having a master branch and development branch. While developing the developers push to the development branch, once the software is at a major milestone they merge the development branch into the master branch, so that has only major milestone versions on it. Meanwhile the developers can continue working on the development branch again.

## How to use Git

There are a lot of tutorials on git you can find on google, I will however give a summary of the core concepts here.
First of all **commit** every time you want to save your changes. A commit is basically a version of your software, you can always to back to your commits at a later point in time.
**Pulling** is the action of getting all commits for some branch from your remote. This way you also get your collaborator's changes.
On the other hand, **pushing** is the opposite of pulling. It pushes your commit history to the remote, so the other collaborators can get it. Remember: always pull before pushing!

Merge conflicts Even though Git keeps track of individual lines, you will have situations where multiple collaborators have changed the same lines. When pulling from the remote, git will automatically detect these so called 'merge conflicts' and ask you to resolve them. The basic way of resolving merge conflicts is to open the file that has the conflict. You will see some lines that basically look like this:

```
<<<<<<< HEAD
nine
=======
eight
>>>>>>> branch-a
```

Basically everything between '<<<<<<<HEAD' and '=====' is what you have for that line, everything between the '==========' line and the '>>>>>>>' line is what you pulled from the remote. Resolve the conflict by just removing everything except the code you want to keep. This can be your stuff, the stuff from the remote or even both! A fixed file could look like this (I chose to keep both):

```
nine
eight
```

## Remotes

A remote is basically a remote location at which your software and its different versions are stored, and which are used to communicate versions to all collaborators of that piece of software. There are many different services providing remotes, though for dota 2 modding I would recommend using Git with one of these two services:

[Github](https://github.com/) - A very user- (and noob-) friendly git provider. Github has a nice interface and very easy to use GUI client for windows. Please note that this client only the absolute basics, if you want more complicated stuff you will need to use the command-line. There are a lot of dota 2 mods on github already, you can just search the site for them, try it!

[BitBucket](https://bitbucket.org/) - Bitbucket also offers a remote service, similar to github. Bitbucket is not as noob-friendly as Github. If you want to use bitbucket you will not be able to use the Github for windows client, more on that later.

## Git clients
There are three main methods of doing git:

* [SourceTree](https://www.sourcetreeapp.com/) - My personal favourite. Sourcetree is a git client with a GUI. At first it may seem a bit intimidating, as there are a lot of options, but after some time you automatically learn how it works. Works with any git remote and provides a lot of functionality.
* [Github client](https://windows.github.com/) - Github provides desktop client with a nice and very user-friendly interface. The drawback of this client is that it only works with github remotes, and only allows the bare minimum of git functionality without opening up the command line. Also only works on windows.
* [Git command line](https://git-scm.com/) - Git is basically command-line driven, so ofcourse you can choose to not use any fancy clients at all, but just type the commands directly into your command line. Other clients are basically just user interfaces built on top of this.

## How to set up a dota 2 mod repository

Setting up a dota 2 mod repository is not entirely trivial, as there two directories you want to include at diffent locations instead of creating your repository on just one directory. You could of course make a repository of your dota_ugc folder, but ideally you would like to have one repository per project instead of having to track changes to all of them in the same repository.

So here is my solution:
I made a directory somewhere on my harddrive, doesn't matter where, and called it 'Dota 2 Mods'. Inside this directory I made different directories for each mod I made, so I would have a Bomberman directory, Invoker Warfare directory, etc etc. So how do I get my mod files in here? The answer is symbolic links, or symlinks for short. A symlink is basically a reference to a different directory on your PC. This means that you can have the same directory at two locations in your file system. Changing the contents of this directory will affect the files in the directory at both locations.

The repository directory will look something like this:
```ts
myproject/
├── game/          // symlink junction to dota 2 beta/game/dota_addons/myproject/
├── content/       // symlink junction to dota 2 beta/content/dota_addons/myproject
└── ...            // other files like documents, scripts, etc can go in myproject/ and your repository too
```

### How to make your dota 2 symlinks
Inside your mod's folder open the command window by shift-rightclicking the folder (make sure you have no files selected) and pressing 'Open command window here'. Now just fill in the commands for each folder you want to include. I'll show you my commands, but keep in mind you might have to change the path to your directories:
```
mklink /j "game" "D:\Program Files\Steam\steamapps\common\dota 2 beta\dota_ugc\game\dota_addons\bomberman"
mklink /j "content" "D:\Program Files\Steam\steamapps\common\dota 2 beta\dota_ugc\content\dota_addons\bomberman"
```

If you did it right you should now see a game and content directory inside your mod's directory! You can now just make a repository of that directory, and it should automatically also take the contents of your symbolically linked directories into account. An additional benefit of this method is that you can also put other things in your mod folder to be included in your version control. Personally I have a documents directory in there too, storing all documents I have produced related to the mod.

**Bonus hint:** Make sure you add thumbnail_cache.bin to your gitignore. It prevents this useless file from bloating your repository.
