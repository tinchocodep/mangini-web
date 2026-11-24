{# Mangini 2026 · Packs (productos de Tiendanube sin variantes).
   Necesita: mg_pack_mesa y mg_pack_deg (si alguno no existe o está oculto, no se muestra).
   Diseño y textos: los de la estrategia comercial (versión web en /nueva). #}
{% if mg_pack_mesa or mg_pack_deg %}
<section class="mg-packs" id="packs">
  <div class="mg-packs-head">
    <h2>Packs</h2>
    <p>Para probar las dos variedades o para resolver la mesa de las fiestas en un solo pedido.</p>
  </div>
  <div class="mg-pack-grid">
    {% if mg_pack_mesa %}
    {% set vm = mg_pack_mesa.variants_object | first %}
    <article class="mg-pack mg-pack-mesa" data-mg-pack="{{ mg_pack_mesa.id }}" data-mg-nombre="Pack Mesa Familiar">
      <span class="mg-pack-badge">Recomendado</span>
      <div class="mg-pack-vis" aria-hidden="true">
        <img style="--mg-px:4%;--mg-py:6%;--mg-pw:50%;--mg-pr:-9deg;--mg-pd:0s" src="{{ 'img/mg/cut-tradicional.webp' | static_url }}" alt="">
        <img style="--mg-px:46%;--mg-py:0%;--mg-pw:50%;--mg-pr:8deg;--mg-pd:-2.4s" src="{{ 'img/mg/cut-tradicional.webp' | static_url }}" alt="">
        <img style="--mg-px:-2%;--mg-py:44%;--mg-pw:36%;--mg-pr:10deg;--mg-pd:-4.1s" src="{{ 'img/mg/cut-frutos.webp' | static_url }}" alt="">
        <img style="--mg-px:66%;--mg-py:44%;--mg-pw:36%;--mg-pr:-8deg;--mg-pd:-1.2s" src="{{ 'img/mg/cut-frutos.webp' | static_url }}" alt="">
        <img style="--mg-px:32%;--mg-py:48%;--mg-pw:36%;--mg-pr:3deg;--mg-pd:-3.3s" src="{{ 'img/mg/cut-tradicional.webp' | static_url }}" alt="">
      </div>
      <div class="mg-pack-body">
        <h3>Mesa Familiar</h3>
        <p class="mg-pack-desc">Para mesas desde 5 personas: 3,5 kg de pan dulce, unas 35 porciones.</p>
        <ul class="mg-pack-list">
          <li><b>2</b>Tradicional 1 kg</li>
          <li><b>1</b>Tradicional 500 g</li>
          <li><b>2</b>Frutos secos 500 g</li>
        </ul>
        <div class="mg-pack-price">
          <strong>{{ vm.price_short }}</strong>
          {% if vm.compare_at_price_short %}<s>{{ vm.compare_at_price_short }}</s><span class="mg-pack-off">15% off</span>{% endif %}
        </div>
        <button class="mg-btn mg-btn-cream mg-btn-wide" type="button" data-mg-add-pack>Agregar al pedido</button>
      </div>
      <span hidden data-mg-sug="{{ mg_pack_mesa.id }}" data-mg-nombre="Pack Mesa Familiar" data-mg-precio="{{ vm.price_short }}" data-mg-img="{{ 'img/mg/cut-tradicional.webp' | static_url }}"></span>
    </article>
    {% endif %}
    {% if mg_pack_deg %}
    {% set vd = mg_pack_deg.variants_object | first %}
    <article class="mg-pack mg-pack-deg" data-mg-pack="{{ mg_pack_deg.id }}" data-mg-nombre="Pack Degustación">
      <div class="mg-pack-vis" aria-hidden="true">
        <img style="--mg-px:4%;--mg-py:8%;--mg-pw:56%;--mg-pr:-10deg;--mg-pd:-1s" src="{{ 'img/mg/cut-tradicional.webp' | static_url }}" alt="">
        <img style="--mg-px:42%;--mg-py:20%;--mg-pw:56%;--mg-pr:9deg;--mg-pd:-3.6s" src="{{ 'img/mg/cut-frutos.webp' | static_url }}" alt="">
      </div>
      <div class="mg-pack-body">
        <h3>Degustación</h3>
        <p class="mg-pack-desc">Uno de cada variedad, en 500 g. Conocé, probá y disfrutá.</p>
        <ul class="mg-pack-list">
          <li><b>1</b>Tradicional 500 g</li>
          <li><b>1</b>Frutos secos 500 g</li>
        </ul>
        <div class="mg-pack-price"><strong>{{ vd.price_short }}</strong></div>
        <button class="mg-btn mg-btn-bordo mg-btn-wide" type="button" data-mg-add-pack>Agregar al pedido</button>
      </div>
      <span hidden data-mg-sug="{{ mg_pack_deg.id }}" data-mg-nombre="Pack Degustación" data-mg-precio="{{ vd.price_short }}" data-mg-img="{{ 'img/mg/cut-frutos.webp' | static_url }}"></span>
    </article>
    {% endif %}
  </div>
</section>
{% endif %}
