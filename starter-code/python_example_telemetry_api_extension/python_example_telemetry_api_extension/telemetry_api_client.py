# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0

import os
from re import T
import requests
import json

TELEMETRY_API_URL = "http://{0}/2022-07-01/telemetry".format(os.getenv("AWS_LAMBDA_RUNTIME_API"))
LAMBDA_EXTENSION_IDENTIFIER_HEADER_KEY = "Lambda-Extension-Identifier"

TIMEOUT_MS = 25; # Maximum time (in milliseconds) that a batch is buffered.
MAX_BYTES = 256*1024; # Maximum size in bytes that the logs are buffered in memory.
MAX_ITEMS = 1000; # Maximum number of events that are buffered in memory.

def subscribe_listener(extension_id, listener_url):
    print ("[telemetry_api_client.subscribe_listener] Subscribing Extension to receive telemetry data. ExtensionsId: {0}, listener url: {1}, telemetry api url: {2}".format(extension_id, listener_url, TELEMETRY_API_URL))
    
    try:
        
        #OUR CODE GOES HERE
        response = "???"

        if response.status_code == 200:
            #OUR CODE GOES HERE
        elif response.status_code == 202:
            #OUR CODE GOES HERE
        else:
            #OUR CODE GOES HERE
        return extension_id

    except Exception as e:
        print("Error registering extension.", e, flush=True)
        raise Exception("Error setting AWS_LAMBDA_RUNTIME_API", e)



