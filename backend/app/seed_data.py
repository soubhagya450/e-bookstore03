import os
from pathlib import Path
from app.models import db, Admin, Category, Book, AdConfig, SiteSetting
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def create_sample_pdf(file_path, title, author, chapters):
    """Generates an authentic multi-page readable PDF book using reportlab."""
    Path(file_path).parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(file_path),
        pagesize=letter,
        rightMargin=54, leftMargin=54,
        topMargin=54, bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'BookTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=32,
        alignment=1, # Center
        textColor=colors.HexColor('#1E293B'),
        spaceAfter=15
    )
    
    author_style = ParagraphStyle(
        'BookAuthor',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=15,
        leading=20,
        alignment=1, # Center
        textColor=colors.HexColor('#475569'),
        spaceAfter=25
    )
    
    meta_style = ParagraphStyle(
        'BookMeta',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=11,
        leading=16,
        alignment=1, # Center
        textColor=colors.HexColor('#64748B'),
        spaceAfter=40
    )
    
    chapter_title_style = ParagraphStyle(
        'ChapterTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=24,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=15,
        spaceAfter=15
    )
    
    body_style = ParagraphStyle(
        'BookBody',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=12,
        leading=18,
        textColor=colors.HexColor('#1E293B'),
        spaceAfter=12,
        firstLineIndent=20
    )
    
    story = []
    
    # Title Page
    story.append(Spacer(1, 100))
    story.append(Paragraph(title, title_style))
    story.append(Paragraph(f"By {author}", author_style))
    story.append(Paragraph("Public Domain Digital Edition &bull; eBook Library", meta_style))
    story.append(Spacer(1, 80))
    story.append(PageBreak())
    
    # Chapters
    for ch_title, ch_paragraphs in chapters:
        story.append(Paragraph(ch_title, chapter_title_style))
        story.append(Spacer(1, 10))
        for p in ch_paragraphs:
            story.append(Paragraph(p, body_style))
        story.append(PageBreak())
        
    doc.build(story)
    return len(chapters) + 1

def create_sample_svg_cover(cover_path, title, author, category, bg_gradient_start, bg_gradient_end):
    """Creates a sleek vector cover art file."""
    Path(cover_path).parent.mkdir(parents=True, exist_ok=True)
    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="100%" height="100%">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:{bg_gradient_start};stop-opacity:1" />
      <stop offset="100%" style="stop-color:{bg_gradient_end};stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.3"/>
    </filter>
  </defs>
  <!-- Background -->
  <rect width="400" height="600" fill="url(#grad)" rx="8" />
  
  <!-- Subtle Spine Line -->
  <line x1="28" y1="0" x2="28" y2="600" stroke="rgba(255,255,255,0.15)" stroke-width="2" />
  <line x1="32" y1="0" x2="32" y2="600" stroke="rgba(0,0,0,0.2)" stroke-width="1.5" />
  
  <!-- Decorative Frame -->
  <rect x="50" y="45" width="310" height="510" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" rx="4" />
  <rect x="56" y="51" width="298" height="498" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1" rx="2" />
  
  <!-- Category Badge -->
  <rect x="70" y="70" width="160" height="24" rx="12" fill="rgba(255,255,255,0.18)" />
  <text x="150" y="86" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">{category.upper()}</text>
  
  <!-- Title -->
  <foreignObject x="70" y="140" width="270" height="200">
    <div xmlns="http://www.w3.org/1999/xhtml" style="color: #ffffff; font-family: 'Georgia', serif; font-size: 26px; font-weight: bold; line-height: 1.25; text-shadow: 0 2px 4px rgba(0,0,0,0.4);">
      {title}
    </div>
  </foreignObject>
  
  <!-- Divider -->
  <line x1="70" y1="380" x2="160" y2="380" stroke="#F59E0B" stroke-width="3" />
  
  <!-- Author -->
  <text x="70" y="420" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="600" fill="#F1F5F9" letter-spacing="0.5">{author}</text>
  
  <!-- Footer Badge -->
  <text x="70" y="525" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="500" fill="rgba(255,255,255,0.6)" letter-spacing="1">PUBLIC DOMAIN EDITION</text>
  <circle cx="330" cy="520" r="14" fill="rgba(255,255,255,0.15)"/>
  <text x="330" y="524" font-family="'Georgia', serif" font-size="13" font-weight="bold" fill="#FFFFFF" text-anchor="middle">e</text>
</svg>"""
    with open(cover_path, "w", encoding="utf-8") as f:
        f.write(svg_content)

def seed_database():
    """Seeds default admin, categories, public domain books, and ad configs."""
    db.create_all()
    
    # 1. Admin Account
    admin = Admin.query.filter_by(username='admin').first()
    if not admin:
        admin = Admin(
            username='admin',
            email='admin@ebook-library.example.org'
        )
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
        print("Default admin created: admin / admin123")

    # 2. Categories
    category_defs = [
        ('Classic Literature', 'classic-literature', 'Timeless masterpieces of world literature from celebrated authors.', 'BookOpen'),
        ('Mystery & Detective', 'mystery-detective', 'Gripping detective inquiries, suspense, and puzzling mysteries.', 'Search'),
        ('Sci-Fi & Fantasy', 'sci-fi-fantasy', 'Pioneering works of speculative fiction, space, time, and imagination.', 'Compass'),
        ('Philosophy & Thought', 'philosophy-thought', 'Reflections on ethics, stoicism, reason, and human nature.', 'Award'),
        ('History & Strategy', 'history-strategy', 'Military strategy, historical records, and enduring life doctrines.', 'Shield'),
        ('Adventure & Wonder', 'adventure-wonder', 'Journeys of wonder, peril, curiosity, and boundless discovery.', 'Feather'),
    ]
    
    category_map = {}
    for name, slug, desc, icon in category_defs:
        cat = Category.query.filter_by(slug=slug).first()
        if not cat:
            cat = Category(name=name, slug=slug, description=desc, icon=icon)
            db.session.add(cat)
            db.session.commit()
        category_map[slug] = cat

    # 3. Ad Configurations
    default_ads = [
        ('home_hero', 'Homepage Hero Leaderboard', True, 'ca-pub-9988776655443322', '1001234567'),
        ('home_grid', 'Homepage Feed Between Cards', True, 'ca-pub-9988776655443322', '1001234568'),
        ('category_banner', 'Category Top Banner', True, 'ca-pub-9988776655443322', '1001234569'),
        ('book_detail_sidebar', 'Book Detail Sidebar Banner', True, 'ca-pub-9988776655443322', '1001234570'),
        ('book_detail_bottom', 'Book Detail Bottom Banner', True, 'ca-pub-9988776655443322', '1001234571')
    ]
    for key, name, enabled, cid, sid in default_ads:
        ad = AdConfig.query.filter_by(slot_key=key).first()
        if not ad:
            ad = AdConfig(slot_key=key, slot_name=name, is_enabled=enabled, ad_client_id=cid, ad_slot_id=sid)
            db.session.add(ad)
    db.session.commit()

    # 4. Site Settings
    default_settings = {
        'site_name': 'eBook – Free Online Digital Library',
        'site_tagline': 'Free Public Domain Books. Zero Login Required. 100% Distraction-Free Reading.',
        'site_description': 'Discover thousands of public domain classics and open-licensed books. Read right inside your browser with automatic progress saving and clean typography.',
        'contact_email': 'contact@ebook-library.example.org',
        'footer_text': '© 2026 eBook Digital Library. Committed to accessible public domain literature worldwide.',
        'privacy_policy': """# Privacy Policy
Last Updated: November 2026

At **eBook Digital Library**, reader privacy is a core principle. Our platform is completely free and requires **no registration or login** for visitors.

### 1. Zero Reader Tracking & No Account Needed
We do not ask for your name, email address, phone number, or payment details to read any book in our collection. You can browse, search, and read completely anonymously.

### 2. Local Storage Usage
Your reading progress, bookmarks, and reading history are saved strictly inside your own device's browser using `localStorage`. This information is never uploaded to or stored on our servers.

### 3. Advertising & Cookies
We utilize Google AdSense to display non-intrusive advertisements on selected public pages (such as the homepage and book detail pages) to support server hosting costs. The reading viewer is strictly **100% advertisement-free**.

### 4. Admin Access
Administrative sessions use secure, encrypted session tokens strictly for website operators to manage library content.
""",
        'terms_conditions': """# Terms and Conditions of Use
Last Updated: November 2026

Welcome to **eBook Digital Library**. By accessing or using our website, you agree to these terms:

### 1. Open Access & Free Reading
All books available on this website are published legally as public domain works or under open licenses (such as Creative Commons). Readers may read them online free of charge.

### 2. Intellectual Property & Copyright Respect
We take copyright seriously. Every published work undergoes verification. If you believe your copyrighted work has been included erroneously, please use our Copyright Complaint form.

### 3. Permitted Use
You may read books online for personal, educational, and research purposes. Automated scraping that degrades server performance is prohibited.
""",
        'about_us': """# About eBook Digital Library

**eBook Digital Library** was established with a singular, clear mission: **to make human knowledge and classic literature universally accessible, frictionless, and free for everyone.**

### Why We Are Different:
- **No Sign-Up Gates:** You will never encounter a mandatory login, paywall, or email gate.
- **In-Browser Reading:** Read instantly without installing proprietary software or third-party apps.
- **Uncompromised Reader Experience:** Advertisements support our operational hosting, but **never intrude upon the reading screen itself**.
- **Progress That Remembers You:** Thanks to modern browser local storage, your reading progress and bookmarks are saved seamlessly on your device.
""",
        'dmca_policy': """# Copyright & DMCA Takedown Policy

eBook Digital Library respects the intellectual property rights of authors, translators, and publishers.

We publish content under:
1. Public Domain status (works whose copyright has expired under applicable laws).
2. Creative Commons and open-access licenses.
3. Express author permission.

### How to Submit a Copyright Inquiry
If you are the copyright holder or an authorized agent and believe a work violates your rights, please submit our online **Copyright Complaint Form** or email `copyright@ebook-library.example.org` with:
- Identification of the copyrighted work.
- The URL / Title of the book on our platform.
- Your contact information and statement of authority.
"""
    }
    
    for k, val in default_settings.items():
        if not SiteSetting.query.filter_by(key=k).first():
            db.session.add(SiteSetting(key=k, value=val))
    db.session.commit()

    # 5. Seed Real Public Domain Books with Generated PDF Files & Vector Covers
    from flask import current_app
    upload_root = Path(current_app.config['UPLOAD_FOLDER'])
    upload_books_dir = upload_root / "books"
    upload_covers_dir = upload_root / "covers"
    upload_books_dir.mkdir(parents=True, exist_ok=True)
    upload_covers_dir.mkdir(parents=True, exist_ok=True)

    books_data = [
        {
            'title': 'The Adventures of Sherlock Holmes',
            'slug': 'the-adventures-of-sherlock-holmes',
            'author': 'Arthur Conan Doyle',
            'category_slug': 'mystery-detective',
            'published_year': 1892,
            'is_featured': True,
            'page_count': 148,
            'file_size': '1.4 MB',
            'bg_start': '#1E293B',
            'bg_end': '#0F172A',
            'description': 'A collection of twelve classic short stories featuring the eccentric and brilliant London consulting detective Sherlock Holmes and his steadfast chronicler, Dr. John H. Watson.',
            'copyright_status': 'public_domain',
            'license_name': 'Public Domain Mark 1.0',
            'copyright_notes': 'Published originally in 1892 in The Strand Magazine. Fully expired copyright globally.',
            'chapters': [
                (
                    "Chapter I: A Scandal in Bohemia",
                    [
                        "To Sherlock Holmes she is always THE woman. I have seldom heard him mention her under any other name. In his eyes she eclipses and predominates the whole of her sex. It was not that he felt any emotion akin to love for Irene Adler. All emotions, and that one particularly, were abhorrent to his cold, precise but admirably balanced mind.",
                        "He was, I take it, the most perfect reasoning and observing machine that the world has seen, but as a lover he would have placed himself in a false position. He never spoke of the softer passions, save with a gibe and a sneer. They were admirable things for the observer—excellent for drawing the veil from men's motives and actions.",
                        "One night—it was on the twentieth of March, 1888—I was returning from a journey to a patient, for I had now returned to civil practice, when my way led me through Baker Street. As I passed the well-remembered door, a keen desire came over me to see Holmes once more, and to know how he was employing his extraordinary powers.",
                        "His rooms were brilliantly lit, and, even as I looked up, I saw his tall, spare figure pass twice in a dark silhouette against the blind. He was pacing the room swiftly, eagerly, with his head sunk upon his chest and his hands clasped behind him. To me, who knew his every mood and habit, his attitude and manner told their own story. He was at work again."
                    ]
                ),
                (
                    "Chapter II: The Red-Headed League",
                    [
                        "I had called upon my friend, Mr. Sherlock Holmes, one day in the autumn of last year and found him in deep conversation with a very stout, florid-faced, elderly gentleman with fiery red hair.",
                        "With an apology for my intrusion, I was about to withdraw when Holmes pulled me abruptly into the room and closed the door behind me.",
                        "'You could not have come at a better time, my dear Watson,' he said cordially.",
                        "'I was afraid that you were engaged.'",
                        "'So I am. Very much so. This gentleman, Mr. Jabez Wilson, has been good enough to call upon me this morning, and to begin a narrative which promises to be one of the most singular which I have listened to for some time.'"
                    ]
                ),
                (
                    "Chapter III: A Case of Identity",
                    [
                        "'My dear fellow,' said Sherlock Holmes as we sat on either side of the fire in his lodgings at Baker Street, 'life is infinitely stranger than anything which the mind of man could invent. We would not dare to conceive the things which are really mere commonplaces of existence.'",
                        "'If we could fly out of that window hand in hand, hover over this great city, gently remove the roofs, and peep in at the queer things which are going on, the strange coincidences, the plannings, the cross-purposes, the wonderful chains of events, working through generations, and leading to the most outre results, it would make all fiction with its conventionalities and foreseen conclusions most stale and unprofitable.'"
                    ]
                )
            ]
        },
        {
            'title': 'Pride and Prejudice',
            'slug': 'pride-and-prejudice',
            'author': 'Jane Austen',
            'category_slug': 'classic-literature',
            'published_year': 1813,
            'is_featured': True,
            'page_count': 234,
            'file_size': '1.8 MB',
            'bg_start': '#831843',
            'bg_end': '#4C0519',
            'description': 'A romantic masterpiece charting the emotional development of Elizabeth Bennet, who learns the error of making hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness.',
            'copyright_status': 'public_domain',
            'license_name': 'Public Domain Mark 1.0',
            'copyright_notes': 'Published originally in 1813 in London. In the public domain in all countries.',
            'chapters': [
                (
                    "Chapter 1: It is a Truth Universally Acknowledged",
                    [
                        "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
                        "However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.",
                        "'My dear Mr. Bennet,' said his lady to him one day, 'have you heard that Netherfield Park is let at last?'",
                        "Mr. Bennet replied that he had not.",
                        "'But it is,' returned she; 'for Mrs. Long has just been here, and she told me all about it.' Mr. Bennet made no answer. 'Do you not want to know who has taken it?' cried his wife impatiently.",
                        "'YOU want to tell me, and I have no objection to hearing it.' This was invitation enough."
                    ]
                ),
                (
                    "Chapter 2: The Arrival of Mr. Bingley",
                    [
                        "Mr. Bennet was among the earliest of those who waited on Mr. Bingley. He had always intended to visit him, though to the last always assuring his wife that he should not go; and till the evening after the visit was paid she had no knowledge of it.",
                        "The astonishment of the ladies was just what he could have wished; that of Mrs. Bennet perhaps surpassing the rest; though, when the first tumult of joy was over, she began to declare that it was what she had expected all the while.",
                        "'How good it was in you, my dear Mr. Bennet! But I knew I should persuade you at last. I was sure you loved your girls too well to neglect such an acquaintance.'"
                    ]
                )
            ]
        },
        {
            'title': 'Frankenstein; or, The Modern Prometheus',
            'slug': 'frankenstein-modern-prometheus',
            'author': 'Mary Shelley',
            'category_slug': 'sci-fi-fantasy',
            'published_year': 1818,
            'is_featured': True,
            'page_count': 186,
            'file_size': '1.2 MB',
            'bg_start': '#064E3B',
            'bg_end': '#022C22',
            'description': 'The groundbreaking gothic science fiction tale of Victor Frankenstein, a young scientist who creates a sapient creature in an unorthodox scientific experiment, exploring creation, grief, and responsibility.',
            'copyright_status': 'public_domain',
            'license_name': 'Public Domain Mark 1.0',
            'copyright_notes': 'Published originally in 1818. Public domain worldwide.',
            'chapters': [
                (
                    "Letter I: To Mrs. Saville, England",
                    [
                        "St. Petersburgh, Dec. 11th, 17--",
                        "You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.",
                        "I am already far north of London, and as I walk through the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight.",
                        "Do you understand this feeling? This breeze, which has traveled from the regions towards which I am advancing, gives me a foretaste of those icy climes. Inspirited by this wind of promise, my daydreams become more fervent and vivid."
                    ]
                ),
                (
                    "Chapter I: The Spark of Being",
                    [
                        "It was on a dreary night of November that I beheld the accomplishment of my toils. With an anxiety that almost amounted to agony, I collected the instruments of life around me, that I might infuse a spark of being into the lifeless thing that lay at my feet.",
                        "It was already one in the morning; the rain pattered dismally against the panes, and my candle was nearly burnt out, when, by the glimmer of the half-extinguished light, I saw the dull yellow eye of the creature open; it breathed hard, and a convulsive motion agitated its limbs.",
                        "How can I describe my emotions at this catastrophe, or how delineate the wretch whom with such infinite pains and care I had endeavoured to form? His limbs were in proportion, and I had selected his features as beautiful. Beautiful! Great God!"
                    ]
                )
            ]
        },
        {
            'title': 'The Art of War',
            'slug': 'the-art-of-war',
            'author': 'Sun Tzu',
            'category_slug': 'history-strategy',
            'published_year': -500,
            'is_featured': True,
            'page_count': 92,
            'file_size': '0.9 MB',
            'bg_start': '#7C2D12',
            'bg_end': '#431407',
            'description': 'An ancient Chinese military treatise attributed to Sun Tzu, composed of 13 chapters devoted to an aspect of strategy and tactics, widely applied to business, conflict resolution, and leadership.',
            'copyright_status': 'public_domain',
            'license_name': 'Public Domain Mark 1.0',
            'copyright_notes': 'Translation by Lionel Giles (1910). Public domain worldwide.',
            'chapters': [
                (
                    "Chapter I: Laying Plans",
                    [
                        "Sun Tzu said: The art of war is of vital importance to the State.",
                        "It is a matter of life and death, a road either to safety or to ruin. Hence it is a subject of inquiry which can on no account be neglected.",
                        "The art of war, then, is governed by five constant factors, to be taken into account in one's deliberations, when seeking to determine the conditions obtaining in the field. These are: The Moral Law; Heaven; Earth; The Commander; Method and discipline.",
                        "All warfare is based on deception. Hence, when able to attack, we must seem unable; when using our forces, we must seem inactive; when we are near, we must make the enemy believe we are far away; when far away, we must make him believe we are near."
                    ]
                ),
                (
                    "Chapter III: Attack by Stratagem",
                    [
                        "Sun Tzu said: In the practical art of war, the best thing of all is to take the enemy's country whole and intact; to shatter and destroy it is not so good. So, too, it is better to recapture an army entire than to destroy it.",
                        "Hence to fight and conquer in all your battles is not supreme excellence; supreme excellence consists in breaking the enemy's resistance without fighting.",
                        "Thus the highest form of generalship is to balk the enemy's plans; the next best is to prevent the junction of the enemy's forces; the next in order is to attack the enemy's army in the field; and the worst policy of all is to besiege walled cities."
                    ]
                )
            ]
        },
        {
            'title': 'Alice’s Adventures in Wonderland',
            'slug': 'alices-adventures-in-wonderland',
            'author': 'Lewis Carroll',
            'category_slug': 'adventure-wonder',
            'published_year': 1865,
            'is_featured': False,
            'page_count': 118,
            'file_size': '1.1 MB',
            'bg_start': '#1E1B4B',
            'bg_end': '#312E81',
            'description': 'The beloved whimsical fantasy following Alice as she falls down a rabbit hole into a fantasy realm of anthropomorphic creatures and unforgettable wordplay.',
            'copyright_status': 'public_domain',
            'license_name': 'Public Domain Mark 1.0',
            'copyright_notes': 'First published in 1865. Global public domain.',
            'chapters': [
                (
                    "Chapter I: Down the Rabbit-Hole",
                    [
                        "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, 'and what is the use of a book,' thought Alice 'without pictures or conversation?'",
                        "So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.",
                        "There was nothing so VERY remarkable in that; nor did Alice think it so VERY much out of the way to hear the Rabbit say to itself, 'Oh dear! Oh dear! I shall be late!'",
                        "Burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge."
                    ]
                )
            ]
        },
        {
            'title': 'Meditations',
            'slug': 'meditations-marcus-aurelius',
            'author': 'Marcus Aurelius',
            'category_slug': 'philosophy-thought',
            'published_year': 180,
            'is_featured': True,
            'page_count': 160,
            'file_size': '1.3 MB',
            'bg_start': '#3F3F46',
            'bg_end': '#18181B',
            'description': 'Personal private writings by the Roman Emperor Marcus Aurelius recording his private notes to himself and ideas on Stoic philosophy, resilience, and personal duty.',
            'copyright_status': 'public_domain',
            'license_name': 'Public Domain Mark 1.0',
            'copyright_notes': 'Ancient text, translation by George Long (1862). In the public domain globally.',
            'chapters': [
                (
                    "Book I: Debts and Lessons",
                    [
                        "From my grandfather Verus I learned good morals and the government of my temper.",
                        "From the reputation and remembrance of my father, modesty and a manly character.",
                        "From my mother, piety and beneficence, and abstinence, not only from evil deeds, but even from evil thoughts; and further, simplicity in my way of living, far removed from the habits of the rich.",
                        "From my governor, to be neither of the green nor of the blue faction at the games in the Circus, nor a partizan of the Parmularius or the Scutarius at the gladiators' fights; from him too I learned endurance of labour, and to want little, and to work with my own hands."
                    ]
                ),
                (
                    "Book II: On the River of Life",
                    [
                        "When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly. They are like this because they cannot distinguish good from evil.",
                        "But I have seen the beauty of good, and the ugliness of evil, and have recognized that the wrongdoer has a nature related to my own—not of the same blood or birth, but the same mind, and possessing a share of the divine.",
                        "None of them can hurt me. No one can implicate me in ugliness. Nor can I feel angry at my relative, or hate him. We were made to work together like feet, like hands, like the rows of the upper and lower teeth. To obstruct each other is unnatural."
                    ]
                )
            ]
        }
    ]

    for b in books_data:
        existing = Book.query.filter_by(slug=b['slug']).first()
        if not existing:
            # Generate PDF file
            pdf_filename = f"{b['slug']}.pdf"
            pdf_disk_path = upload_books_dir / pdf_filename
            create_sample_pdf(pdf_disk_path, b['title'], b['author'], b['chapters'])
            
            # Generate Vector Cover
            cover_filename = f"cover_{b['slug']}.svg"
            cover_disk_path = upload_covers_dir / cover_filename
            cat_name = category_map[b['category_slug']].name
            create_sample_svg_cover(
                cover_disk_path,
                b['title'],
                b['author'],
                cat_name,
                b['bg_start'],
                b['bg_end']
            )
            
            new_book = Book(
                title=b['title'],
                slug=b['slug'],
                author=b['author'],
                description=b['description'],
                category_id=category_map[b['category_slug']].id,
                cover_url=f"/api/uploads/covers/{cover_filename}",
                file_type='pdf',
                file_url=f"/api/uploads/books/{pdf_filename}",
                file_size=b['file_size'],
                page_count=b['page_count'],
                language='English',
                published_year=b['published_year'],
                is_featured=b['is_featured'],
                is_published=True,
                copyright_status=b['copyright_status'],
                license_name=b['license_name'],
                copyright_notes=b['copyright_notes'],
                view_count=120
            )
            db.session.add(new_book)
            print(f"Seeded book: {b['title']}")
            
    db.session.commit()
    print("Database seeding completed successfully!")
