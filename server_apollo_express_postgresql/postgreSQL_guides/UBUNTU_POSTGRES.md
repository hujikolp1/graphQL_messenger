PostgreSQL
PostgreSQL is an object-relational database system that has the features of traditional commercial database systems with enhancements to be found in next-generation DBMS systems.

Installation
To install PostgreSQL, run the following command in the command prompt:

sudo apt install postgresql
The database service is automatically configured with viable defaults, but can be customized based on your specialized needs.

Configuration
PostgreSQL supports multiple client authentication methods. By default, the IDENT authentication method is used for postgres and local users. Please refer to the PostgreSQL Administrator’s Guide if you would like to configure alternatives like Kerberos.

The following discussion assumes that you wish to enable TCP/IP connections and use the MD5 method for client authentication. PostgreSQL configuration files are stored in the /etc/postgresql/<version>/main directory. For example, if you install PostgreSQL 12, the configuration files are stored in the /etc/postgresql/12/main directory.

Tip

To configure IDENT authentication, add entries to the /etc/postgresql/12/main/pg_ident.conf file. There are detailed comments in the file to guide you.

To enable other computers to connect to your PostgreSQL server, edit the file /etc/postgresql/12/main/postgresql.conf

Locate the line #listen_addresses = ‘localhost’ and change it to:

listen_addresses = '*'
Note

To allow both IPv4 and IPv6 connections replace ‘localhost’ with ‘::’

For details on other parameters, refer to the configuration file or to the PostgreSQL documentation for information on how they can be edited.

Now that we can connect to our PostgreSQL server, the next step is to set a password for the postgres user. Run the following command at a terminal prompt to connect to the default PostgreSQL template database:

sudo -u postgres psql template1
The above command connects to PostgreSQL database template1 as user postgres. Once you connect to the PostgreSQL server, you will be at a SQL prompt. You can run the following SQL command at the psql prompt to configure the password for the user postgres.

ALTER USER postgres with encrypted password 'your_password';
After configuring the password, edit the file /etc/postgresql/12/main/pg_hba.conf to use MD5 authentication with the postgres user:

local   all         postgres                          md5
Finally, you should restart the PostgreSQL service to initialize the new configuration. From a terminal prompt enter the following to restart PostgreSQL:

sudo systemctl restart postgresql.service
Warning

The above configuration is not complete by any means. Please refer to the PostgreSQL Administrator’s Guide to configure more parameters.

You can test server connections from other machines by using the PostgreSQL client.

sudo apt install postgresql-client
psql -h postgres.example.com -U postgres -W 
Note

Replace the domain name with your actual server domain name.

Streaming Replication
PostgreSQL has a nice feature called Streaming Replication which provides the capability to continuously ship and apply the WAL XLOG records to some number of standby servers in order to keep them current. Here is presented a very basic and simple way to replicate a PostgreSQL server (master) in a standby server.

First, create a replication user in the master to be used by the standby server:

$ sudo -u postgres createuser --replication -P -e replicator
Let’s configure the master server to turn on the streaming replication. Open the file /etc/postgresql/12/main/postgresql.conf and make sure you have the following lines:

listen_addresses = '*'
wal_level = replica
max_wal_senders = 10
Also edit the file /etc/postgresql/12/main/pg_hba.conf to add an extra line to allow tthe standby server connection using the replicator user:

host  replication   replicator   <IP address of the standby>      md5
Restart the service to apply changes:

$ sudo systemctl restart postgresql
Now, in the standby server, let’s stop the PostgreSQL service:

$ sudo systemctl stop postgresql
Edit the /etc/postgresql/12/main/postgresql.conf to set up hot standby:

hot_standby = on
Back up the current state of the master server:

$ sudo su - postgres
$ cp -R /var/lib/postgresql/12/main /var/lib/postgresql/12/main_bak
$ rm -rf /var/lib/postgresql/12/main/* # remove all the files in the data directory
$ pg_basebackup -h <IP adrress of the master> -D /var/lib/postgresql/12/main -U replicator -P -v -R
In the pg_basebackup command the flags represent the following:

-h: the hostname or IP address of the master server
-D: the data directory
-U: the user to be used in the operation
-P: tuns on progess reporting
-v: enables verbose mode
-R: Creates a standby.signal file and append connection settings to postgresql.auto.conf
Finally, let’s start the PostgreSQL service on standby server:

$ sudo systemctl start postgresql
To make sure it is working, go to the master server and run the following command:

$ sudo -u postgres psql -c "select * from pg_stat_replication;"
You need to see an entry for the standby server. As you can see in the presented row the data synchronization is assynchronous. If you want to make it synchronous, go to the /etc/postgresql/12/main/postgresql.conf file in the master server and make sure you have the following lines:

synchronous_commit = on
synchronous_standby_names = '*' # you can also specify a IP address
And restart the service:

$ sudo systemctl restart postgresql
Now, you can check the pg_stat_replication table again and the sync_state of the standby server need to become sync instead of async:

$ sudo -u postgres psql -c "select * from pg_stat_replication;"
To test the replication you can now create a test database in the master and check if it is replicated in the standby server:

$ sudo -u postgres createdb test # on the master server
$ sudo -u postgres psql -c "\l" # on the standby server
You need to be able to see the test database created on the master in the standby server.

Backups
PostgreSQL databases should be backed up regularly. Refer to the PostgreSQL Administrator’s Guide for different approaches.

Resources
As mentioned above the PostgreSQL Administrator’s Guide is an excellent resource. The guide is also available in the postgresql-doc-12 package. Execute the following in a terminal to install the package:

sudo apt install postgresql-doc-12
To view the guide enter file:///usr/share/doc/postgresql-doc-12/html/index.html into the address bar of your browser.

For general SQL information see the O’Reilly books Getting Started with SQL: A Hands-On Approach for Beginners by Thomas Nield as an entry point and SQL in a Nutshell as a quick reference.

Also, see the PostgreSQL Ubuntu Wiki page for more information.