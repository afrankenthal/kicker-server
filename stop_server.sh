#!/bin/sh

# This script stops the node.js server. Shouldn't have to be used,
# but it's here just in case. 

kill -9 $(ps | grep [n]ode | grep [s]erver | awk '{print $1;}')
