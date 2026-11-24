{# Mangini 2026 · Reseña con fotos reales, regalos empresariales, preguntas frecuentes y cierre.
   Opcional: mg_whatsapp_comercial (solo números, con código de país, ej. 5491112345678). #}
<section class="mg-real">
  <div class="mg-real-quote">
    <blockquote>“Un pan dulce entre los mejores del mundo.”</blockquote>
    <p>Reseña en Tripadvisor sobre la sucursal de Federico Lacroze, mayo de 2022.</p>
  </div>
  <div class="mg-reel" aria-hidden="true">
    {% for vuelta in 1..2 %}
      {% for f in ['tradicional.jpg', 'duo-espejo.jpg', 'jardin-mesa.jpg', 'frutos-secos.jpg', 'hero-caja.jpg', 'frutos-mano.jpg', 'duo-flores.jpg', 'jardin-bokeh.jpg'] %}
        <img src="{{ ('img/mg/' ~ f) | static_url }}" alt="" loading="lazy">
      {% endfor %}
    {% endfor %}
  </div>
</section>

{% set mg_wa_texto = 'Hola, quiero consultar por pan dulce Mangini para regalos empresariales. Empresa: . Cantidad estimada: . Presentación: . Localidad: . Fecha en que lo necesitamos: .' %}
{% if mg_whatsapp_comercial %}{% set mg_wa_url = 'https://wa.me/' ~ mg_whatsapp_comercial ~ '?text=' ~ (mg_wa_texto | url_encode) %}{% else %}{% set mg_wa_url = '#' %}{% endif %}
<section class="mg-biz" id="empresas">
  <div class="mg-biz-inner">
    <div>
      <h2>Regalos empresariales</h2>
      <p>Pan dulce Mangini en su caja para tu equipo o tus clientes. Te pasamos la cotización por WhatsApp con el área comercial.</p>
      <ul><li>Empresa y localidad</li><li>Cantidad estimada</li><li>Variedad y tamaño</li><li>Fecha de entrega</li></ul>
      <a class="mg-btn mg-btn-bordo" href="{{ mg_wa_url }}" target="_blank" rel="noopener"><img src="{{ 'img/mg/whatsapp.png' | static_url }}" alt="">Cotizar por WhatsApp</a>
    </div>
    <div class="mg-biz-box">
      <img src="{{ 'img/mg/cut-caja.webp' | static_url }}" alt="Caja de pan dulce Mangini" loading="lazy">
      <span class="mg-ing" style="--mg-x:-6%;--mg-y:8%;--mg-s:90px;--mg-d:0;--mg-t:9s;--mg-rot:-15deg"><img src="{{ 'img/mg/ing-nuez.webp' | static_url }}" alt=""></span>
      <span class="mg-ing" style="--mg-x:86%;--mg-y:-4%;--mg-s:80px;--mg-d:0;--mg-t:10s"><img src="{{ 'img/mg/ing-cereza.webp' | static_url }}" alt=""></span>
      <span class="mg-ing" style="--mg-x:90%;--mg-y:74%;--mg-s:96px;--mg-d:0;--mg-t:11s;--mg-rot:25deg"><img src="{{ 'img/mg/ing-almendra.webp' | static_url }}" alt=""></span>
    </div>
  </div>
</section>

<section class="mg-faq" id="preguntas">
  <h2>Preguntas frecuentes</h2>
  <details open><summary>¿A dónde envían?</summary><p>A todo el país. En CABA con reparto propio; al resto del país, por correo. El costo depende de tu código postal y lo ves antes de pagar.</p></details>
  <details><summary>¿Cuándo llega?</summary><p>Te mostramos el plazo estimado cuando ponés tu código postal. Despachamos en días hábiles.</p></details>
  <details><summary>¿Cómo pago?</summary><p>Por transferencia tenés 5% de descuento adicional y despachamos cuando se acredita. También podés pagar con Mercado Pago, o en efectivo si lo retirás en un local.</p><p><span class="mg-tbd">A confirmar: si el 5% por transferencia aplica también a unidades sueltas y al pack Degustación, el recargo de Mercado Pago (“tasa + diferencia”) y el precio en efectivo.</span></p></details>
  <details><summary>¿Cómo se conserva?</summary><p><span class="mg-tbd">A confirmar por producción: duración y forma de conservación.</span></p></details>
  <details><summary>Ingredientes y alérgenos</summary><p><span class="mg-tbd">A confirmar por producción: ingredientes completos y alérgenos de cada variedad.</span></p></details>
  <details><summary>¿Puedo retirarlo en un local?</summary><p>Sí, y podés pagarlo en efectivo al retirar.</p><p><span class="mg-tbd">A confirmar: en qué locales, desde qué fecha y con qué packaging.</span></p></details>
</section>

<section class="mg-closing">
  <span class="mg-ing" style="--mg-x:6%;--mg-y:16%;--mg-s:240px;--mg-d:0;--mg-t:9s;--mg-rot:-12deg"><img src="{{ 'img/mg/cut-tradicional.webp' | static_url }}" alt="" loading="lazy"></span>
  <span class="mg-ing" style="--mg-x:76%;--mg-y:44%;--mg-s:260px;--mg-d:0;--mg-t:10s;--mg-rot:10deg"><img src="{{ 'img/mg/cut-frutos.webp' | static_url }}" alt="" loading="lazy"></span>
  <span class="mg-ing mg-far" style="--mg-x:30%;--mg-y:74%;--mg-s:70px;--mg-d:0;--mg-t:12s"><img src="{{ 'img/mg/ing-cereza.webp' | static_url }}" alt=""></span>
  <span class="mg-ing mg-far" style="--mg-x:66%;--mg-y:10%;--mg-s:60px;--mg-d:0;--mg-t:11s"><img src="{{ 'img/mg/ing-almendra.webp' | static_url }}" alt=""></span>
  <h2>Este año, el pan dulce es Mangini</h2>
  <a class="mg-btn mg-btn-cream" href="#elegir">Elegir mi pan dulce</a>
</section>
