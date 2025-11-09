from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def home(request):
    return HttpResponse("<h2>AI Chat Portal Backend is running 🚀</h2>")

urlpatterns = [
     path('', home),  # 👈 homepage
    path('admin/', admin.site.urls),
    path('api/', include('conversations.urls')),  # 👈 add this line
]
