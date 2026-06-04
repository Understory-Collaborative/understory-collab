#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont

# Palette
CANOPY=(0x20,0x4E,0x4A); FOREST=(0x2D,0x5A,0x3D); SAGE=(0x82,0xA3,0xA1)
SAND=(0xE8,0xA8,0x7C); EMBER=(0xBC,0x6C,0x25); CREAM=(0xFE,0xFA,0xE0)
INK=(0x18,0x2A,0x22); WHITE=(255,255,255)
BG=(0xF4,0xF1,0xE8)

def font(sz, bold=False):
    paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]
    for p in paths:
        try: return ImageFont.truetype(p, sz)
        except: pass
    return ImageFont.load_default()

def text(d, xy, s, f, fill, anchor=None):
    d.text(xy, s, font=f, fill=fill, anchor=anchor)

# ---------- Image 1: Swatches ----------
def swatches():
    W,H=1200,560
    img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    text(d,(48,34),"Understory — Mixed Palette",font(40,True),CANOPY)
    text(d,(48,90),"Greens & teal carry trust. Sand & ember carry warmth + the wildfire theme.",font(22),(0x4a,0x5a,0x50))
    cols=[("Canopy Teal","#204E4A",CANOPY,CREAM,"Deep base / shade"),
          ("Forest","#2D5A3D",FOREST,WHITE,"Primary brand (existing)"),
          ("Sage Mist","#82A3A1",SAGE,INK,"Cool support / borders"),
          ("Sand","#E8A87C",SAND,INK,"Warm accent (existing)"),
          ("Ember","#BC6C25",EMBER,WHITE,"Heat accent / wildfire"),
          ("Cream","#FEFAE0",CREAM,CANOPY,"Warm light canvas")]
    n=len(cols); pad=40; gap=22
    cw=(W-2*pad-(n-1)*gap)//n; x=pad; top=150; chh=190
    for name,hx,col,tcol,role in cols:
        d.rounded_rectangle([x,top,x+cw,top+chh],radius=14,fill=col)
        text(d,(x+16,top+chh-40),"Aa",font(30,True),tcol)
        d.rounded_rectangle([x,top+chh+8,x+cw,top+chh+150],radius=12,fill=WHITE)
        text(d,(x+14,top+chh+20),name,font(21,True),INK)
        text(d,(x+14,top+chh+52),hx,font(19),(0x5b,0x6a,0x60))
        # wrap role
        words=role.split(); line=""; yy=top+chh+86
        for w in words:
            t=(line+" "+w).strip()
            if font(17).getlength(t)>cw-26:
                text(d,(x+14,yy),line,font(17),(0x5b,0x6a,0x60)); yy+=24; line=w
            else: line=t
        text(d,(x+14,yy),line,font(17),(0x5b,0x6a,0x60))
        x+=cw+gap
    img.save("/home/user/understory-collab/preview-1-swatches.png")

# ---------- Image 2: Two leans ----------
def mock(d, x, y, w, label, navcol, herocol, herotxt, tagcol, tag, head, sub,
         b1col, b1txt, b2bordercol, b2txt):
    text(d,(x,y-34),label,font(22,True),CANOPY)
    h=300
    # nav
    d.rounded_rectangle([x,y,x+w,y+h],radius=16,fill=herocol)
    d.rectangle([x,y,x+w,y+52],fill=navcol)
    d.rounded_rectangle([x,y,x+w,y+30],radius=16,fill=navcol)
    text(d,(x+20,y+15),"Understory Collaborative",font(18,True),WHITE)
    text(d,(x+w-260,y+17),"Advisory · Implementation · Contact",font(14),WHITE)
    # hero
    text(d,(x+24,y+78),tag,font(15,True),tagcol)
    # head wrap
    yy=y+104
    for line in head:
        text(d,(x+24,yy),line,font(27,True),herotxt); yy+=34
    text(d,(x+24,yy+6),sub,font(16),herotxt)
    by=y+h-58
    # button1
    bw=font(16,True).getlength(b1txt)+44
    d.rounded_rectangle([x+24,by,x+24+bw,by+38],radius=9,fill=b1col)
    text(d,(x+24+bw/2,by+19),b1txt,font(16,True),b1txt2(b1col),anchor="mm")
    # button2 outline
    b2w=font(16,True).getlength(b2txt)+44
    bx=x+24+bw+14
    d.rounded_rectangle([bx,by,bx+b2w,by+38],radius=9,outline=b2bordercol,width=2)
    text(d,(bx+b2w/2,by+19),b2txt,font(16,True),b2bordercol,anchor="mm")

def b1txt2(col):
    return WHITE if sum(col)<400 else INK

def leans():
    W,H=1200,440
    img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    text(d,(48,24),"Same system — two leans",font(30,True),CANOPY)
    mw=520
    mock(d,48,110,mw,"Enterprise lean — green & cream",FOREST,CREAM,INK,FOREST,
         "ADVISORY & IMPLEMENTATION",
         ["We create the conditions","for organizations to flourish."],
         "Accessible, ethical technology & collaborative practice.",
         FOREST,"Get in Touch",CANOPY,"Our Services")
    mock(d,48+mw+64,110,mw,"Founder lean — teal & ember",CANOPY,CANOPY,CREAM,SAND,
         "WE MEET YOU WHERE YOU ARE",
         ["What's on fire?"],
         "A 2-minute technical health check. No vendor pitch.",
         EMBER,"Take the Quiz",SAND,"Read the Papers")
    img.save("/home/user/understory-collab/preview-2-leans.png")

# ---------- Image 3: Metaphors + contrast ----------
def contrast():
    W,H=1200,620
    img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    text(d,(48,28),"Two metaphors, separate territory",font(28,True),CANOPY)
    text(d,(48,72),"Greens = grow (Root→Rise→Flourish).  Ember/sand = burn (wildfire papers).",font(18),(0x4a,0x5a,0x50))
    tiers=[("Smolder",CREAM,CANOPY,(0xe2,0xdc,0xcb)),("Brush Fire",SAND,INK,SAND),
           ("Crown Fire",EMBER,WHITE,EMBER),("Firestorm",(0x7a,0x2e,0x12),WHITE,(0x7a,0x2e,0x12))]
    x=48; ty=110
    for name,bg,fg,_ in tiers:
        tw=font(18,True).getlength(name)+40
        d.rounded_rectangle([x,ty,x+tw,ty+40],radius=8,fill=bg,outline=(0xe2,0xdc,0xcb))
        text(d,(x+tw/2,ty+20),name,font(18,True),fg,anchor="mm")
        x+=tw+14

    text(d,(48,185),"Contrast — measured WCAG ratios",font(26,True),CANOPY)
    rows=[("Canopy Teal on Cream","8.9:1","AAA",CREAM,CANOPY),
          ("Forest on Cream","7.6:1","AAA",CREAM,FOREST),
          ("White on Forest","8.0:1","AAA",FOREST,WHITE),
          ("White on Canopy Teal","9.3:1","AAA",CANOPY,WHITE),
          ("Sand on Canopy Teal","4.6:1","AA",CANOPY,SAND),
          ("Ink on Sand","10.3:1","AAA",SAND,INK),
          ("White on Ember","4.0:1","AA large only",EMBER,WHITE),
          ("Ember on Cream","3.8:1","AA large only",CREAM,EMBER),
          ("Sand on Cream","1.9:1","Decorative only",CREAM,SAND),
          ("Sage on Cream","2.6:1","Decorative only",CREAM,SAGE)]
    y=232; rh=35
    badgecol={"AAA":(0x1f,0x7a,0x3f),"AA":FOREST,"AA large only":(0xdd,0xa1,0x5e),"Decorative only":(0xc0,0x39,0x2b)}
    for label,ratio,verdict,bg,fg in rows:
        text(d,(60,y+8),label,font(18),INK)
        text(d,(430,y+8),ratio,font(18,True),INK)
        bc=badgecol[verdict]; btw=font(15,True).getlength(verdict)+24
        d.rounded_rectangle([520,y+4,520+btw,y+28],radius=12,fill=bc)
        btc=INK if verdict=="AA large only" else WHITE
        text(d,(520+btw/2,y+16),verdict,font(15,True),btc,anchor="mm")
        # sample chip
        sx=520+btw+30
        d.rounded_rectangle([sx,y+2,sx+150,y+30],radius=6,fill=bg)
        text(d,(sx+75,y+16),"Sample text",font(15,True),fg,anchor="mm")
        d.line([48,y+rh-2,W-48,y+rh-2],fill=(0xe2,0xdc,0xcb))
        y+=rh
    img.save("/home/user/understory-collab/preview-3-contrast.png")

swatches(); leans(); contrast()
print("ok")
