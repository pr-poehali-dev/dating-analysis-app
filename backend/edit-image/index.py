import json
import os
import base64
import requests
from io import BytesIO
from PIL import Image
import boto3

def handler(event: dict, context) -> dict:
    '''API для редактирования изображений с помощью DALL-E 2'''
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
    image_data = body.get('image', '')
    mask_data = body.get('mask', '')
    prompt = body.get('prompt', '')

    if not image_data or not prompt:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Image and prompt are required'})
        }

    openai_api_key = os.environ.get('OPENAI_API_KEY')
    if not openai_api_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'OPENAI_API_KEY not configured'})
        }

    if image_data.startswith('data:image'):
        image_data = image_data.split(',')[1]
    
    img_bytes = base64.b64decode(image_data)
    img = Image.open(BytesIO(img_bytes)).convert('RGBA')
    
    if img.size != (1024, 1024):
        img = img.resize((1024, 1024), Image.Resampling.LANCZOS)
    
    img_buffer = BytesIO()
    img.save(img_buffer, format='PNG')
    img_buffer.seek(0)

    files = {
        'image': ('image.png', img_buffer, 'image/png'),
        'prompt': (None, prompt),
        'n': (None, '1'),
        'size': (None, '1024x1024')
    }

    if mask_data:
        if mask_data.startswith('data:image'):
            mask_data = mask_data.split(',')[1]
        mask_bytes = base64.b64decode(mask_data)
        mask_img = Image.open(BytesIO(mask_bytes)).convert('RGBA')
        
        if mask_img.size != (1024, 1024):
            mask_img = mask_img.resize((1024, 1024), Image.Resampling.LANCZOS)
        
        mask_buffer = BytesIO()
        mask_img.save(mask_buffer, format='PNG')
        mask_buffer.seek(0)
        files['mask'] = ('mask.png', mask_buffer, 'image/png')

    headers = {'Authorization': f'Bearer {openai_api_key}'}

    response = requests.post(
        'https://api.openai.com/v1/images/edits',
        headers=headers,
        files=files,
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

    file_key = f'edited/{context.request_id}.png'
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