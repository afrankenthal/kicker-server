#!/bin/sh
### BEGIN INIT INFO
# Provides:         node.js script to start server
# Required-Start:   $remote_fs $syslog
# Required-Stop:    $remote_fs $syslog
# Default-Start:    2 3 4 5
# Default-Stop:     0 1 6
# Short-Description: Start node.js at boot time
# Description:      Enable node.js at boot time
### END INIT INFO

# Start up the node.js server, this script should run at boot-up.
# To configure this script to run on boot-up (on Linux, including
# Intel Galileo), copy ths file to /etc/init.d/ and then invoke
# update-rc.d start_server.sh defaults
# After this command and boot-up the server should start automatically.

node /home/root/kicker-server/server.js
