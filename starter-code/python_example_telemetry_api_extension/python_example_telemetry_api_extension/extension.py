# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0

import sys
import time

from pathlib import Path
from queue import Queue
from extensions_api_client import register_extension, next
from telemetry_http_listener import start_http_listener
from telemetry_api_client import subscribe_listener
from telemetry_dispatcher import dispatch_telemetry

def main():
    print("Starting the Telemetry API Extension", flush=True)

    extension_name = Path(__file__).parent.name
    print("Extension Main: Registering the extension using extension name: {0}".format(extension_name), flush=True)    
    #extension_id = register_extension(extension_name)

    print("Extension Main: Starting the http listener which will receive data from Telemetry API", flush=True)    
    queue = Queue()
    #listener_url = start_http_listener(queue)
    
    print("Extension Main: Subscribing the listener to TelemetryAPI", flush=True)    
    #subscribe_listener(extension_id, listener_url)
    
    while True:
        print("Extension Main: Next", flush=True)    
        #event_data = next(extension_id)

if __name__ == "__main__":
    main()
