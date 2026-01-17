import json
import os
import base64
import requests
from io import BytesIO
import boto3

def handler(event: dict, context) -> dict:
    '''API для генерации изображений с помощью DALL-E 3'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }

    body_str = event.get('body', '{}')
    if not body_str:
        body_str = '{}'
    body = json.loads(body_str)
    prompt = body.get('prompt', '')

    if not prompt:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Prompt is required'})
        }

    openai_api_key = os.environ.get('OPENAI_API_KEY')
    if not openai_api_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'OPENAI_API_KEY not configured'})
        }

    headers = {
        'Authorization': f'Bearer {openai_api_key}',
        'Content-Type': 'application/json'
    }

    payload = {
        'model': 'dall-e-3',
        'prompt': prompt,
        'n': 1,
        'size': '1024x1024',
        'quality': 'standard'
    }

    response = requests.post(
        'https://api.openai.com/v1/images/generations',
        headers=headers,
        json=payload,
        timeout=60
    )

    if response.status_code != 200:
        return {
            'statusCode': response.status_code,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'OpenAI API error: {response.text}'})
        }

    result = response.json()
    image_url = result['data'][0]['url']

    img_response = requests.get(image_url, timeout=30)
    img_data = img_response.content

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
    )

    file_key = f'generated/{context.request_id}.png'
    s3.put_object(
        Bucket='files',
        Key=file_key,
        Body=img_data,
        ContentType='image/png'
    )

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{file_key}"

    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'url': cdn_url})
    }