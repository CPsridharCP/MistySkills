import json
import base64
import boto3
import os
from contextlib import closing
import logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

import time
import requests
from pubnub.callbacks import SubscribeCallback
from pubnub.enums import PNStatusCategory
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub

def publish_callback(result, status):
    if not status.is_error():
        return True
    else:
        return False

def lambda_handler(event, context):

    pnconfig = PNConfiguration()
 
    pnconfig.subscribe_key = '<pubnub-subscribe-key>'
    pnconfig.publish_key = '<pubnub-publish-key>'
    
    pubnub = PubNub(pnconfig)
    
    logger.info(event['body'])

    text = json.loads(event['body'])['text']
    logger.info(text)
    
    polly = boto3.client('polly')
    response = polly.synthesize_speech(OutputFormat='mp3',Text = text,VoiceId = "Salli")
        
    if "AudioStream" in response:
        with closing(response["AudioStream"]) as stream:
            audio = base64.encodebytes(stream.read())
         
    out = str(audio.decode("ascii")).replace('\n', '')
    logger.info(out)
    logger.info(len(out))
    
    try:    
        if len(out)>28000:
            
            for count in range(int(len(out)/28000)):
                iterRem = int(len(out)/28000)-count
                if count == 0:
                    data = {'say': out[28000*count:28000*(count+1)], 'type': 'say', 'next' : count+1, 'text' : text }
                else:
                    data = {'say': out[28000*count:28000*(count+1)], 'type': 'say', 'next' : count+1, 'text' : text }
                _ = pubnub.publish().channel("<pubnub-channel>").message(data).pn_async(publish_callback)
                time.sleep(0.5)
            
            data = {'say': out[28000*(count+1):], 'type': 'say', 'next' : "None", 'text' : text}
            _ = pubnub.publish().channel("<pubnub-channel>").message(data).pn_async(publish_callback)
            time.sleep(0.5)
        
        else:
            data = {'say': out, 'type': 'say',  'next' : "None", 'text' : text}
            _ = pubnub.publish().channel("<pubnub-channel>").message(data).pn_async(publish_callback)
            time.sleep(0.5)

        return {'statusCode': 200,'body' : json.dumps(text)}

    except:
        logger.info("FAIL IN LAMBDA TTS")
        return {'statusCode': 200,'body' : json.dumps("Some Error in Lambda , Please Retry")}