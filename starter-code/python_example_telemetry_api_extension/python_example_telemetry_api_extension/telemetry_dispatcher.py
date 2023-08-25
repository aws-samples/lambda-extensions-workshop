import os
import requests
import json
from queue import Queue

AWS_LAMBDA_FUNCTION_NAME = os.environ.get('AWS_LAMBDA_FUNCTION_NAME')

#Environment variables used to configure extension function
DISPATCH_POST_URI = os.getenv("DISPATCH_POST_URI")
ENDPOINT_USER = os.getenv("ENDPOINT_USER")
ENDPOINT_PASSWORD = os.getenv("ENDPOINT_PASSWORD")
DISPATCH_MIN_BATCH_SIZE = int(os.getenv("DISPATCH_MIN_BATCH_SIZE"))


def dispatch_telemetry(queue, force):
    while ((not queue.empty()) and (force or queue.qsize() >= DISPATCH_MIN_BATCH_SIZE)):
        print ("[telemetry_dispatcher] Dispatch telemetry data")
        filtered_queue_metrics = []
        filtered_queue_logs = []
        batch = queue.get_nowait()

        #iterate through events in the batch
        for event in batch:
            #1. get event types that we are interested in -- 1/ function logs 2/ execution reports 
           

        #Transform data to match backend API
        log_data = format_log_data(filtered_queue_logs)
        metric_data = format_metric_data(filtered_queue_metrics)

        #Dispatch data to backend API 
        post_data(log_data,'log')
        post_data(metric_data,'metric')
