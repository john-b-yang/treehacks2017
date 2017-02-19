import random
import numpy as np
from scipy.spatial.distance import euclidean
from fastdtw import fastdtw

def dist(x, y):
    distance, path = fastdtw(x, y, dist=euclidean)
    return distance

def get_nns(data, point, k):
    distances = []
    for i in range(len(data)):
        distances.append([i, dist(data[i], point[1:])])
    distances.sort(key=lambda x: x[1])
    distances = [row[0] for row in distances]
    return distances[:k]

def get_class(data, point, k):
    nns = get_nns([row[1:] for row in data], point, k)
    vote = 0
    for nn in nns:
        if data[nn][0]:
            vote += 1
        else:
            vote -= 1
    if vote > 0:
        return 1
    else:
        return 0

def train(class1, class2):
    random.shuffle(class1)
    random.shuffle(class2)
    train1 = class1[:len(class1)//5]
    test1 = class1[len(class1)//5:]
    train2 = class2[:len(class2)//5]
    test2 = class2[len(class2)//5:]
    accuracy = []
    for i in range(min(len(class1), len(class2)) // 4):
        k = 2*i + 1
        num_correct = 0
        for j in range(len(test1)):
            prediction = get_class(train1 + train2, test1[j], k)
            if prediction == test1[j][0]:
                num_correct += 1
        for j in range(len(test2)):
            prediction = get_class(train1 + train2, test2[j], k)
            if prediction == test2[j][0]:
                num_correct += 1
        accuracy.append([k, num_correct/(len(test1) + len(test2))])
        print(accuracy[len(accuracy)-1])
    return accuracy

def predict(point, class1, class2):
    prediction =  get_class(class1 + class2, [-1] + point, 3)
    if prediction == 0:
        return "Negative Diagnosis"
    else:
        return "Positive Diagonosis"

with open("regular.txt") as f:
    regular = f.read()
with open("parkinsons.txt") as f:
    parkinsons = f.read()

regular = regular.split('\n')
parkinsons = parkinsons.split('\n')

reg_class = []
park_class = []

current_series = []
for i in range(len(regular)):
    if regular[i] != "+++":
        if int(regular[i]) > 3500:
            current_series.append(1)
        else:
            current_series.append(0)
    else:
        if len(current_series) > 250:
            current_series = current_series[0:250]
        else:
            for j in range(250-len(current_series)):
                current_series.append(current_series[len(current_series)-1])
        reg_class.append([0] + current_series)
        current_series = []

for i in range(len(parkinsons)):
    if parkinsons[i] != "+++":
        if int(parkinsons[i]) > 3500:
            current_series.append(1)
        else:
            current_series.append(0)
    else:
        if len(current_series) > 250:
            current_series = current_series[0:250]
        else:
            for j in range(250-len(current_series)):
                current_series.append(current_series[len(current_series)-1])
        park_class.append([1] + current_series)
        current_series = []

print(train(reg_class, park_class))
