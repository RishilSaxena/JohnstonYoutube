import sys
import nltk
import re
import string;
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter
from gensim.models import Word2Vec
from gensim.models import Phrases
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('punkt')
from nltk.tokenize import word_tokenize
from nltk.tokenize import sent_tokenize
from nltk.corpus import stopwords
import openai
import requests
import re
import pprint
import pandas as pd
from cryptography.fernet import Fernet
from flask import Flask, jsonify
from bs4 import BeautifulSoup as bs
import requests

def getYoutubeTags(url):
    request = requests.get(url)
    html = bs(request.content, "html.parser")
    tags = html.find_all("meta", property="og:video:tag")
    result = [];
    for tag in tags:
        result.append(tag['content']);
    return result;


def scrape(query):
    url = f"https://www.googleapis.com/youtube/v3/search?key={sys.argv[3]}&q={query}&part=snippet,id&order=date&maxResults=20&type=video"

    r = requests.get(url)
    # print(r.status_code)

    data = r.json()
    # print(data)
    list_ids = [item['id']['videoId'] for item in data.get("items", [])]
    # print(list_ids)
    tagArray = [];
    for list_id in list_ids:
        tags = getYoutubeTags(f"https://www.youtube.com/watch?v={list_id}")
        for tag in tags:
            tagArray.append(tag.lower())

    # print(tagArray);
    tag_count = {}
    for element in tagArray:
        if element in tag_count:
            tag_count[element] += 1
        else:
            tag_count[element] = 1

    tag_count = sorted(tag_count.items(), key=lambda x:x[1], reverse=True)
    tag_dict = dict(tag_count)
    return tag_count

def remove_stopwords(sentences):
    stop_words = set(stopwords.words('english'))
    filtered_sentences = []

    for sentence in sentences:
        words = word_tokenize(sentence)
        filtered_words = [word for word in words if word.casefold() not in stop_words]
        filtered_sentence = ' '.join(filtered_words)
        filtered_sentences.append(filtered_sentence)
    return filtered_sentences

def remove_punctuation(sentences):
    punctuation = string.punctuation
    filtered_sentences = []

    for sentence in sentences:
        filtered_sentence = ''.join(char for char in sentence if char not in punctuation)
        filtered_sentences.append(filtered_sentence)

    return filtered_sentences

def generate_tags():
    transcript = YouTubeTranscriptApi.get_transcript(sys.argv[2])
    formatter = TextFormatter();
    text = formatter.format_transcript(transcript)

    text = re.sub(r'\[[0-9]*\]',' ',text) # [0-9]* --> Matches zero or more repetitions of any digit from 0 to 9
    text = text.lower() #everything to lowercase
    text = re.sub(r'\W^.?!',' ',text) # \W --> Matches any character which is not a word character except (.?!)
    text = re.sub(r'\d',' ',text) # \d --> Matches any decimal digit
    text = re.sub(r'\s+',' ',text) # \s --> Matches any characters that are considered whitespace (Ex: [\t\n\r\f\v].)

    sentences = sent_tokenize(text);
    sentences = remove_stopwords(sentences);
    word2vec_list = [];
    for sentence in sentences:
        word2vec_list.append(word_tokenize(remove_punctuation([sentence])[0]))

    bigram_transformer = Phrases(word2vec_list)
    model = Word2Vec(bigram_transformer[word2vec_list], min_count=4)
    most_common_words = model.wv.index_to_key[:20]
    most_common_words = [ele for ele in most_common_words if len(ele) >= 3]
    search_terms = ["mini itx build",
                        "fractal terra",
                        "itx build",
                        "fractal terra build",
                        "micro atx build",
                        "fractal ridge",
                        "mini itx",
                        "matx case",
                        "nzxt h1 v2 build",
                        "mini itx build 2023",
                        "best itx case",
                        ]
    for term in search_terms:
        other_tags = scrape(term)[:5]
        for tag in other_tags:
            most_common_words.append(tag[0])
    most_common_words = list(set(most_common_words))
    result = '['
    for word in most_common_words:
        result += ('"' + word + '",')
    result = result[0:len(result)-1]
    result += ("]")
    print(result)

def default_gen_titles():
    youtube_key = input('Enter your YouTube Data API v3 key: ')
    openai_key = input('Enter your OpenAI API key: ')
    video_id = input('Enter the id of your video: ')

    base_url = "https://www.googleapis.com/youtube/v3/videos"
    params = {
        "part": "snippet",
        "id": video_id,
        "key": youtube_key
    }

    try:
        response = requests.get(base_url, params=params)

        if response.status_code == 200:
            data = response.json()
            video = data["items"][0]
            description = video["snippet"]["description"]
            print("Video Description: ", description)
        else:
            print("Request failed with status code:", response.status_code)
    except requests.exceptions.RequestException as e:
        print("An error occurred:", e)
    
    if (description):
        openai.api_key = openai_key

        response = openai.Completion.create(
          engine="davinci",
          prompt=f"Generate three titles based on the description: \"{description}\". \n1.",
          max_tokens=60,
          n=3,
          stop="\n",
          temperature=0.4
        )

        if response:
            for i, title in enumerate(response.choices):
                print(f"Title {i + 1}: {title['text'].strip()}")

if(sys.argv[1] == "generate_tags"):
    generate_tags()
elif sys.argv[1] == "default_generate_titles":
    default_gen_titles()

# print("connected to python")
sys.stdout.flush()
