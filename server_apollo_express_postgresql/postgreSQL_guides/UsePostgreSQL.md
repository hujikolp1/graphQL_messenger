apt show postgresql
In my Ubuntu 18.04, it showed that the available version of PostgreSQL is version 10 (10+190 means version 10) whereas PostgreSQL version 11 is already released.

Package: postgresql
Version: 10+190
Priority: optional
Section: database
Source: postgresql-common (190)
Origin: Ubuntu
Based on this information, you can make your mind whether you want to install the version available from Ubuntu or you want to get the latest released version of PostgreSQL.

I’ll show both methods to you.

Method 1: Install PostgreSQL from Ubuntu repositories
In the terminal, use the following command to install PostgreSQL

sudo apt update
sudo apt install postgresql postgresql-contrib
Enter your password when asked and you should have it installed in a few seconds/minutes depending on your internet speed. Speaking of that, feel free to check various network bandwidth in Ubuntu.

What is postgresql-contrib?

The postgresql-contrib or the contrib package consists some additional utilities and functionalities that are not part of the core PostgreSQL package. In most cases, it’s good to have the contrib package installed along with the PostgreSQL core.

Method 2: Installing the latest version 11 of PostgreSQL in Ubuntu
To install PostgreSQL 11, you need to add the official PostgreSQL repository in your sources.list, add its certificate and then install it from there.

Don’t worry, it’s not complicated. Just follow these steps.

Add the GPG key first:

wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
Now add the repository with the below command. If you are using Linux Mint, you’ll have to manually replace the `lsb_release -cs` the Ubuntu version your Mint release is based on.

sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'
Everything is ready now. Install PostgreSQL with the following commands:

sudo apt update
sudo apt install postgresql postgresql-contrib
PostgreSQL GUI application

You may also install a GUI application (pgAdmin) for managing PostgreSQL databases:

sudo apt install pgadmin4

Configuring PostgreSQL
You can check if PostgreSQL is running by executing:

service postgresql status
Via the service command you can also start, stop or restart postgresql. Typing in service postgresql and pressing Enter should output all options. Now, onto the users.

By default, PostgreSQL creates a special user postgres that has all rights. To actually use PostgreSQL, you must first log in to that account:

sudo su postgres
Your prompt should change to something similar to:

postgres@ubuntu-VirtualBox:/home/ubuntu$ 
Now, run the PostgreSQL Shell with the utility psql:

psql
You should be prompted with:

postgress=# 
You can type in \q to quit and \? for help.

To see all existing tables, enter:

\l
The output will look similar to this (Hit the key q to exit this view):

PostgreSQL Tables
PostgreSQL Tables
With \du you can display the PostgreSQL users:

PostgreSQL Users
PostgreSQLUsers
You can change the password of any user (including postgres) with:

ALTER USER postgres WITH PASSWORD 'my_password';
Note: Replace postgres with the name of the user and my_password with the wanted password. Also, don’t forget the ; (semicolumn) after every statement.

It is recommended that you create another user (it is bad practice to use the default postgres user). To do so, use the command:

CREATE USER my_user WITH PASSWORD 'my_password';
If you run \du, you will see, however, that my_user has no attributes yet. Let’s add Superuser to it:

ALTER USER my_user WITH SUPERUSER;
You can remove users with:

DROP USER my_user;
To log in as another user, quit the prompt (\q) and then use the command:

psql -U my_user
You can connect directly to a database with the -d flag:

psql -U my_user -d my_db
You should call the PostgreSQL user the same as another existing user. For example, my use is ubuntu. To log in, from the terminal I use:

psql -U ubuntu -d postgres
Note: You must specify a database (by default it will try connecting you to the database named the same as the user you are logged in as).

If you have a the error:

psql: FATAL:  Peer authentication failed for user "my_user"
Make sure you are logging as the correct user and edit /etc/postgresql/11/main/pg_hba.conf with administrator rights:

sudo vim /etc/postgresql/11/main/pg_hba.conf 
Note: Replace 11 with your version (e.g. 10).

Here, replace the line:

local   all             postgres                                peer
With:

local   all             postgres                                md5
Then restart PostgreSQL:

sudo service postgresql restart
Using PostgreSQL is the same as using any other SQL type database. I won’t go into the specific commands, since this article is about getting you started with a working setup. However, here is a very useful gist to reference! Also, the man page (man psql) and the documentation are very helpful.

Wrapping Up

Reading this article has hopefully guided you through the process of installing and preparing PostgreSQL on an Ubuntu system. If you are new to SQL, you should read this article to know the basic SQL commands: