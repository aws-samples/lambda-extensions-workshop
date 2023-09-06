import os
import requests
import json
from queue import Queue

AWS_LAMBDA_FUNCTION_NAME = os.environ.get('AWS_LAMBDA_FUNCTION_NAME')

#Environment variables used to configure extension function
DISPATCH_POST_URI = os.getenv("DISPATCH_POST_URI")
ENDPOINT_USER = os.getenv("ENDPOINT_USER")
ENDPOINT_PASSWORD = os.getenv("ENDPOINT_PASSWORD")

def dispatch_telemetry(queue, force):
    while (not queue.empty()):
        print ("[telemetry_dispatcher] Dispatch telemetry data")
        filtered_queue_metrics = []
        filtered_queue_logs = []
        batch = queue.get_nowait()

       #iterate through events in the batch
        for event in batch:
            #get event types that we are interested in -- 1/ function logs 2/ execution reports 
            if event.get('type') == "function":
                filtered_queue_logs.append(event)
            elif event.get('type') == "platform.report":
                filtered_queue_metrics.append(event)

        #Transform data to match backend API
        log_data = format_log_data(filtered_queue_logs)
        metric_data = format_metric_data(filtered_queue_metrics)

        #Dispatch data to backend API 
        post_data(log_data,'log')
        post_data(metric_data,'metric')

def post_data(data,endpoint):

    #OUR CODE GOES HERE

    return True

def format_log_data(filtered_queue):

    #OUR CODE GOES HERE

    return True

def format_metric_data(filtered_queue):

    #OUR CODE GOES HERE

    return True
