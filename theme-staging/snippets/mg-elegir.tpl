{# Mangini 2026 · "Elegí el tuyo": una tarjeta por variedad con tamaño, cantidad y agregar.
   Necesita: mg_trad y mg_fs. Los precios salen de las variantes de Tiendanube. #}
<section class="mg-choose" id="elegir">
  <div class="mg-choose-head">
    <h2>Elegí el tuyo</h2>
    <p>Dos variedades, dos tamaños. Podés combinarlos en el mismo pedido y pagás todo junto.</p>
  </div>
  <div class="mg-prods">
    {% for prod in [
      { p: mg_trad, nombre: 'Tradicional', desc: 'Frutas secas, escurridas y glasé.', img: 'img/mg/cut-tradicional.webp' },
      { p: mg_fs, nombre: 'Frutos secos', desc: 'Coronado de frutos secos enteros.', img: 'img/mg/cut-frutos.webp' }
    ] %}
      {% if prod.p %}
      <article class="mg-prod" data-mg-prod="{{ prod.p.id }}" data-mg-nombre="{{ prod.nombre }}" data-mg-variantes="{{ prod.p.variants_object | json_encode }}">
        <img class="mg-prod-img" src="{{ prod.img | static_url }}" alt="Pan dulce {{ prod.nombre }}">
        <div class="mg-prod-top"><h3>{{ prod.nombre }}</h3>{% if prod.p.available %}<span class="mg-prod-tag">Hay stock</span>{% endif %}</div>
        <p class="mg-prod-desc">{{ prod.desc }}</p>
        <div class="mg-seg" role="group" aria-label="Tamaño">
          {% for v in prod.p.variants_object %}
            <button type="button" data-mg-size="{{ v.option0 }}" class="{{ v.option0 == '1 kg' ? 'mg-on' : '' }}"{% if not v.available %} disabled{% endif %}>{{ v.option0 }}</button>
          {% endfor %}
        </div>
        <div class="mg-prod-buy">
          <span class="mg-prod-price" data-mg-price></span>
          <div class="mg-qty"><button type="button" data-mg-q="-1" aria-label="Uno menos">−</button><output data-mg-qo>1</output><button type="button" data-mg-q="1" aria-label="Uno más">+</button></div>
          <button class="mg-btn mg-btn-bordo" type="button" data-mg-add-prod>Agregar al pedido</button>
        </div>
        {# Sugerencias para el panel "Tu pedido" #}
        {% for v in prod.p.variants_object %}
          <span hidden data-mg-sug="{{ prod.p.id }}" data-mg-opcion="{{ v.option0 }}" data-mg-nombre="{{ prod.nombre }} {{ v.option0 }}" data-mg-precio="{{ v.price_short | replace({',00': ''}) }}" data-mg-img="{{ prod.img | static_url }}"></span>
        {% endfor %}
      </article>
      {% endif %}
    {% endfor %}
  </div>
  <div class="mg-ship">
    <div><h3>Envío a todo el país</h3><p>CABA con reparto propio, resto del país por correo. Ves el costo y el plazo en el carrito, antes de pagar.</p></div>
    <div class="mg-apps">También en <img src="{{ 'img/mg/logo-rappi.png' | static_url }}" alt="Rappi"><img src="{{ 'img/mg/logo-pedidosya.png' | static_url }}" alt="PedidosYa"></div>
  </div>
</section>
