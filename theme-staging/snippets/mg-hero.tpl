{# Mangini 2026 · Hero con la baraja flotante.
   Necesita: mg_trad y mg_fs (productos de Tiendanube con variantes "500 g" / "1 kg"). #}
<section class="mg-hero" data-mg-hero>
  <div class="mg-hero-copy">
    <p class="mg-hero-kicker"><img src="{{ 'img/mg/suit-g-oro.png' | static_url }}" alt="">Temporada 2026</p>
    <h1>Pan dulce <span>Mangini</span></h1>
    <p class="mg-hero-lede">Receta tradicional, hecho en nuestra planta. Elegí el tuyo y te lo mandamos a todo el país en su caja.</p>
    <div class="mg-hero-ctas">
      <a class="mg-btn mg-btn-cream" href="#elegir">Comprar ahora</a>
      <a class="mg-btn mg-btn-line" href="#empresas">Regalos empresariales</a>
    </div>
    <div class="mg-hero-meta">
      <div><b>Desde 2004</b>Producción propia</div>
      <div><b>Todo el país</b>Envío a domicilio</div>
    </div>
  </div>

  <div class="mg-deck-wrap">
    <div class="mg-deck">
      {% for card in [
        { p: mg_trad, slot: 'l', i: 0, z: 1, pip: 'T', nombre: 'Tradicional', img: 'img/mg/cut-tradicional.webp', alt: 'Pan dulce Tradicional con glasé' },
        { p: mg_fs, slot: 'r', i: 2, z: 2, pip: 'F', nombre: 'Frutos secos', img: 'img/mg/cut-frutos.webp', alt: 'Pan dulce de Frutos secos' }
      ] %}
        {% if card.p %}
        <div class="mg-card" data-slot="{{ card.slot }}" style="--mg-i:{{ card.i }};z-index:{{ card.z }}">
          <div class="mg-card-float">
            <a class="mg-card-face" href="#elegir">
              <span class="mg-pip mg-pip-tl"><img src="{{ 'img/mg/suit-g.png' | static_url }}" alt="">{{ card.pip }}</span>
              <span class="mg-pip mg-pip-br"><img src="{{ 'img/mg/suit-g.png' | static_url }}" alt="">{{ card.pip }}</span>
              <div class="mg-card-info">
                <h3>{{ card.nombre }}</h3>
                <span class="mg-card-prices">
                  {% for v in card.p.variants_object %}<span>{{ v.option0 }} <b>{{ v.price_short | replace({',00': ''}) }}</b></span>{% endfor %}
                </span>
              </div>
            </a>
            <img class="mg-card-prod" src="{{ card.img | static_url }}" alt="{{ card.alt }}">
            <button class="mg-card-add" type="button" data-mg-quick="{{ card.p.id }}" data-mg-opcion="1 kg" data-mg-nombre="{{ card.nombre }} 1 kg" aria-label="Agregar {{ card.nombre }} 1 kg al pedido">+</button>
          </div>
        </div>
        {% endif %}
      {% endfor %}
      <div class="mg-card mg-card-box" data-slot="c" style="--mg-i:1;z-index:3">
        <div class="mg-card-float">
          <a class="mg-card-face" href="#empresas">
            <span class="mg-pip mg-pip-tl"><img src="{{ 'img/mg/suit-g.png' | static_url }}" alt="">R</span>
            <span class="mg-pip mg-pip-br"><img src="{{ 'img/mg/suit-g.png' | static_url }}" alt="">R</span>
            <div class="mg-card-info">
              <h3>Para regalar</h3>
              <span class="mg-card-prices"><span>Viene en su caja Mangini</span></span>
            </div>
          </a>
          <img class="mg-card-prod" src="{{ 'img/mg/cut-caja.webp' | static_url }}" alt="Caja de pan dulce Mangini">
        </div>
      </div>
    </div>
  </div>

  <span class="mg-ing mg-far"  style="--mg-x:44%;--mg-y:12%;--mg-s:70px;--mg-d:.4;--mg-t:11s;--mg-rot:-20deg"><img src="{{ 'img/mg/ing-almendra.webp' | static_url }}" alt=""></span>
  <span class="mg-ing"         style="--mg-x:90%;--mg-y:16%;--mg-s:110px;--mg-d:1;--mg-t:9s;--mg-rot:15deg;--mg-z:6"><img src="{{ 'img/mg/ing-nuez.webp' | static_url }}" alt=""></span>
  <span class="mg-ing mg-near" style="--mg-x:91%;--mg-y:80%;--mg-s:118px;--mg-d:1.6;--mg-t:10s;--mg-rot:-10deg;--mg-z:6"><img src="{{ 'img/mg/ing-cereza.webp' | static_url }}" alt=""></span>
  <span class="mg-ing mg-far"  style="--mg-x:58%;--mg-y:88%;--mg-s:58px;--mg-d:.5;--mg-t:12s"><img src="{{ 'img/mg/ing-naranja.webp' | static_url }}" alt=""></span>
  <span class="mg-ing"         style="--mg-x:96%;--mg-y:48%;--mg-s:84px;--mg-d:.9;--mg-t:8s;--mg-rot:30deg"><img src="{{ 'img/mg/ing-avellana.webp' | static_url }}" alt=""></span>
  <span class="mg-ing mg-far"  style="--mg-x:62%;--mg-y:6%;--mg-s:56px;--mg-d:.3;--mg-t:13s;--mg-rot:40deg"><img src="{{ 'img/mg/ing-verde.webp' | static_url }}" alt=""></span>
  <span class="mg-ing"         style="--mg-x:45%;--mg-y:84%;--mg-s:84px;--mg-d:.8;--mg-t:10s;--mg-rot:-25deg;--mg-z:6"><img src="{{ 'img/mg/ing-higo.webp' | static_url }}" alt=""></span>
  <span class="mg-ing mg-far"  style="--mg-x:3%;--mg-y:88%;--mg-s:80px;--mg-d:.4;--mg-t:12s;--mg-rot:20deg"><img src="{{ 'img/mg/ing-nuez2.webp' | static_url }}" alt=""></span>
</section>

<div class="mg-ticker" aria-hidden="true">
  <div class="mg-ticker-track">
    {% for vuelta in 1..2 %}
      {% for t in ['Envíos a todo el país', '5% off pagando por transferencia', 'Hecho en nuestra planta desde 2004', 'Regalos empresariales', 'Cinco locales en Buenos Aires'] %}
        <span>{{ t }}</span><img src="{{ 'img/mg/ing-cereza.webp' | static_url }}" alt="">
      {% endfor %}
    {% endfor %}
  </div>
</div>
