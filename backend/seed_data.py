import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import HeroSlide, ExpertiseCard, Project, TimelineEntry, BlogPost, SiteSettings
from django.contrib.auth import get_user_model

User = get_user_model()

# Admin user
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@niikpakpo.com', 'admin123')
    print("Created admin user: admin / admin123")

# Site Settings
s = SiteSettings.get()
s.contact_email = 'contact@niikpakpo.com'
s.location = 'Accra, Ghana'
s.save()
print("Site settings saved.")

# Hero Slides
HeroSlide.objects.all().delete()
slides = [
    dict(headline="Expertise, Innovation, Impact", subtitle="Shaping the future of Maritime and TVET industries in Ghana and beyond.", button_text="Who is Edgar Nii Kpakpo", button_url="/about", button_style="primary", order=0),
    dict(headline="Pioneering Maritime Education", subtitle="Developing skilled professionals for global shipping and offshore industries.", button_text="View Our Projects", button_url="/portfolio", button_style="accent", background_image="https://via.placeholder.com/1920x1080/0A3D62/FFFFFF?text=Maritime+Training", order=1),
    dict(headline="Driving TVET Transformation", subtitle="Empowering Ghana's youth with critical technical and vocational skills.", button_text="Discover My Expertise", button_url="/portfolio", button_style="primary", background_image="https://via.placeholder.com/1920x1080/075542/FFFFFF?text=TVET+Skills", order=2),
    dict(headline="Ready to Collaborate?", subtitle="Let's connect and build a brighter future for industry and education.", button_text="Get In Touch Now", button_url="/contact", button_style="secondary", order=3),
]
for s in slides:
    HeroSlide.objects.create(**s)
print(f"Created {len(slides)} hero slides.")

# Expertise Cards
ExpertiseCard.objects.all().delete()
cards = [
    dict(icon="fas fa-ship", title="Maritime Education", description="Developing and delivering expert training programs for the next generation of maritime and oil & gas professionals.", order=0),
    dict(icon="fas fa-cogs", title="TVET Advancement", description="Championing Competency-Based Training (CBT) to build a skilled, industry-ready workforce for Ghana's future.", order=1),
    dict(icon="fas fa-tools", title="Engineering & Consulting", description="Providing expert solutions in welding, fabrication, and asset integrity for critical industrial projects.", order=2),
]
for c in cards:
    ExpertiseCard.objects.create(**c)
print(f"Created {len(cards)} expertise cards.")

# Projects
Project.objects.all().delete()
projects = [
    dict(title="Offshore Training Center Development", description="Played a pivotal role in the design, setup, and curriculum development for multiple maritime and offshore training centers across Africa and Asia.", image_url="https://placehold.co/600x400/0A3D62/FFFFFF?text=Training+Center", status="completed", order=0),
    dict(title="TVET Curriculum Modernization", description="Continuously developing and refining industry-relevant curricula that align with the latest technological advancements and employer needs in Ghana.", image_url="https://placehold.co/600x400/18b15b/FFFFFF?text=TVET+Curriculum", status="ongoing", order=1),
]
for p in projects:
    Project.objects.create(**p)
print(f"Created {len(projects)} projects.")

# Timeline
TimelineEntry.objects.all().delete()
timeline = [
    dict(degree="PhD Candidate, Material Science and Engineering", institution="University of Ghana, Legon", description="Research focus on welding, fabrication, and corrosion, with study at the University of Pretoria.", order=0),
    dict(degree="MSc, Mechanical Engineering Technology", institution="University of Education, Winneba", order=1),
    dict(degree="BSc, Instrumentation and Control Engineering", institution="Regent University College of Science and Technology", order=2),
]
for t in timeline:
    TimelineEntry.objects.create(**t)
print(f"Created {len(timeline)} timeline entries.")

# Blog Posts
BlogPost.objects.all().delete()
posts = [
    dict(title="The Future of TVET in Ghana's Economy", category="tvet", summary="A comprehensive vision for leveraging Technical and Vocational Education to drive industrialization and create sustainable jobs for the youth...", content="Edgar Nii Kpakpo Addo shares a comprehensive vision for leveraging Technical and Vocational Education and Training to drive industrialization and create sustainable jobs for the youth. The core of this vision is competency-based training that aligns directly with industry needs, ensuring graduates are not just certified, but are genuinely job-ready. 'We must shift our focus from purely academic qualifications to practical, demonstrable skills,' he argues. 'That is the cornerstone of economic liberation for our nation.'", image_url="https://placehold.co/800x450/075542/FFFFFF?text=TVET+Future", is_featured=True),
    dict(title="Innovations in Maritime Safety Training", category="maritime", summary="Exploring the latest methodologies and technologies being integrated into maritime education to ensure the highest safety and competency standards.", content="Exploring the latest methodologies and technologies being integrated into maritime education to ensure the highest safety and competency standards. This includes the use of advanced simulators, virtual reality scenarios for emergency response, and updated curricula on environmental protection regulations. These innovations are crucial for preparing the next generation of seafarers for the complex challenges of modern shipping.", image_url="https://placehold.co/800x450/B71C1C/FFFFFF?text=Maritime+Safety"),
    dict(title="Advancements in Welding and Fabrication", category="engineering", summary="A deep dive into new materials and techniques that are revolutionizing the engineering sector, with a focus on sustainable and durable infrastructure.", content="A deep dive into new materials and techniques that are revolutionizing the engineering sector, with a focus on sustainable and durable infrastructure. The post discusses the importance of asset integrity and how certified professionals play a key role in maintaining critical structures in the oil & gas and maritime industries. Nii Kpakpo emphasizes the need for continuous professional development to keep up with these rapid advancements.", image_url="https://placehold.co/800x450/0A3D62/FFFFFF?text=Welding+Tech"),
]
for p in posts:
    BlogPost.objects.create(**p)
print(f"Created {len(posts)} blog posts.")

print("\nDone! Admin login: username=admin, password=admin123")
