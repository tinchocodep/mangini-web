{# Mangini 2026 · Página de pan dulce completa (para incluir en el inicio o en una página propia).

   Antes de incluirla, definí en el template:
     mg_trad        → producto "Pan Dulce Especial de Frutas Mangini" (id 301465458)
     mg_fs          → producto "Pan Dulce Especial de Frutos Secos" (id 303353732)
     mg_pack_mesa   → producto Pack Mesa Familiar (id 383018642), opcional
     mg_pack_deg    → producto Pack Degustación (id 383018784), opcional
     mg_whatsapp_comercial → opcional, número para cotizar regalos empresariales
     mg_envios      → true cuando la tienda tenga un medio de envío a domicilio activo (si no, los textos hablan de retiro gratis)

   Y cargá en el layout:
     {{ 'css/mangini.css' | static_url | css_tag }}
     {{ 'js/mangini.js' | static_url | script_tag }}
     <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
     <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
#}
<div class="mg-root" data-mg-envios="{% if mg_envios %}1{% else %}0{% endif %}">
  {% include 'snippets/mg-hero.tpl' %}
  {% include 'snippets/mg-elegir.tpl' %}
  {% include 'snippets/mg-packs.tpl' %}
  {% include 'snippets/mg-story.tpl' %}
  {% include 'snippets/mg-secciones.tpl' %}
</div>
