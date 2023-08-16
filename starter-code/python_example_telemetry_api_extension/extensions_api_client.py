# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0

import os
import sys
import requests
import json


REGISTRATION_REQUEST_BASE_URL = "???"

def register_extension(extension_name):
    print ("[extension_api_client.register_extension] Registering Extension using {0}".format(REGISTRATION_REQUEST_BASE_URL))
    
    try:
        #OUR CODE GOES HERE

    except Exception as e:
        print("[extension_api_client.register_extension] Error registering extension: ",e, flush=True)
        raise Exception("Error setting AWS_LAMBDA_RUNTIME_API", e)


def next(extension_id):

    try:
        #OUR CODE GOES HERE

    except Exception as e:
        print("[extension_api_client.next] Error registering extension.", e, flush=True)
        raise Exception("Error setting AWS_LAMBDA_RUNTIME_API", e)
