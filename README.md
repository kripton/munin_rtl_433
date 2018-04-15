munin_rtl_433
=============

Requests the last sensor values via HTTP from rtl_433_accumulate and formats them suitable for munin

Install
-------
Make sure you have NodeJS and NPM installed. Then clone the repo, cd into the directory and run:

    npm install

to install the dependencies.

Then, cd into your munin's plugin directory and create symlinks to index.js with either temperature or humidity (or both) in the filename:

    cd /etc/munin/plugins/
    ln -s ~/git/munin_rtl_433/index.js rtl_443_temperature
    ln -s ~/git/munin_rtl_433/index.js rtl_443_humidity

Set up your munin's node configuration to provide the correct environment variables to the Plugin:
 * HOST is the hostname where the [rtl_433_accumulate](https://github.com/kripton/rtl_433_accumulate) server is running (default if not set: 127.0.0.1)
 * PORT is the port where the [rtl_433_accumulate](https://github.com/kripton/rtl_433_accumulate) server is running (default if not set: 3005)
 * SENSORMAPPING is a JSON-object mapping sensor ids to readable names. This is done so that sensors can change their id (on battery change for example) but still have their values mapped to the same graph in munin as before. This way, multiple sensors of the same type are also supported at the same time. Make sure that the readable names are unique! Example: ```{"inFactory_sensor_id_78":"Balcony","inFactory_sensor_id_240":"Garden house","HIDEKI_TS04_sensor_rc_1":"Neighbour","TFA_pool_temperature_sensor_id_198":"Neighbour's Pool"}```
