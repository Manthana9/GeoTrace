
from django.shortcuts import render

def home(request):
    return render(request, 'locator/home.html')

def results(request):
    return render(request, 'locator/results.html')
