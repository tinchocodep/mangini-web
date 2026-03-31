import requests, json, time

API = "https://api.tiendanube.com/v1/7497005"
TOKEN = "259f205f9f430ecfd8e7cc9044ee5ca5e66117ac"
UA = "Mangini (manginiconfiterias@gmail.com)"
AUTH_HEADERS = {
    "Authentication": f"bearer {TOKEN}",
    "User-Agent": UA,
    "Content-Type": "application/json"
}

CAT_MAP = {
    "Facturas": 37882856,
    "Tortas": 37882857,
    "Tartas y Salados": 37882858,
    "Panes": 37882859,
}

PRODUCTS = [
    {"name":"Medialunas Dulces","desc":"Medialunas de manteca recién horneadas, crocantes y tiernas.","price":14300,"cat":"Facturas","img":"img/MEDIALUNAS DULCES.JPG"},
    {"name":"Medialunas Saladas","desc":"Medialunas saladas ideales para sándwich o acompañar.","price":14300,"cat":"Facturas","img":"img/medialunas saladas.JPG"},
    {"name":"Facturas Surtidas","desc":"Vigilantes, cañoncitos, cremona, bola de fraile y más.","price":14300,"cat":"Facturas","img":"img/FACTURAS SURTIDAS.JPG"},
    {"name":"Cremonas","desc":"Rellenas de crema pastelera artesanal. Un clásico Mangini.","price":2050,"cat":"Facturas","img":"img/cremonas.JPG"},
    {"name":"Tortitas Negras","desc":"Tortitas negras con cobertura de azúcar quemada, receta tradicional.","price":2050,"cat":"Facturas","img":"img/tortitas negras.JPG"},
    {"name":"Masitas Surtidas","desc":"Bandeja de masitas finas artesanales, variedad de sabores.","price":28500,"cat":"Facturas","img":"img/masitas.JPG"},
    {"name":"Mini Alfajores de Maicena","desc":"Alfajorcitos caseros con dulce de leche y coco rallado.","price":6650,"cat":"Facturas","img":"img/Mini Alfajoreces de maicena.JPG"},
    {"name":"Pastaflora de Batata","desc":"Pastaflora casera rellena de dulce de batata, receta clásica.","price":26000,"cat":"Facturas","img":"img/PASTAFLORA DE BATATA.JPG"},
    {"name":"Torta Mangini","desc":"Nuestra torta insignia con cobertura de chocolate y frutilla.","price":35700,"cat":"Tortas","img":"img/torta mangini .JPG"},
    {"name":"Torta Balcarce","desc":"Bizcochuelo, crema chantilly, merengue y dulce de leche.","price":35700,"cat":"Tortas","img":"img/torta balcarce .JPG"},
    {"name":"Torta Niza","desc":"Brownie, dulce de leche y merengue italiano. Irresistible.","price":35700,"cat":"Tortas","img":"img/torta niza.JPG"},
    {"name":"Torta Aconcagua","desc":"Glaseado de chocolate intenso con terminación artesanal.","price":35700,"cat":"Tortas","img":"img/torta aconcagua.JPG"},
    {"name":"Tarta de Puerro y Jamón","desc":"Tarta individual con puerro, jamón y queso gratinado.","price":6100,"cat":"Tartas y Salados","img":"img/tarta de puerro y jamon.JPG"},
    {"name":"Tarta de Calabaza","desc":"Tarta individual cremosa de calabaza asada.","price":6100,"cat":"Tartas y Salados","img":"img/tarta de calabaza.JPG"},
    {"name":"Tarta Calabaza y Acelga","desc":"Combinación de calabaza y acelga en masa casera.","price":6100,"cat":"Tartas y Salados","img":"img/tarta calabaza y acelga.JPG"},
    {"name":"Tarta de Queso","desc":"Tarta individual de queso gratinado, masa crocante.","price":6100,"cat":"Tartas y Salados","img":"img/tarta salada de queso .JPG"},
    {"name":"Canastita de Jamón y Queso","desc":"Canasta de jamón y queso en masa hojaldrada.","price":2850,"cat":"Tartas y Salados","img":"img/canastita de jyq.JPG"},
    {"name":"Canastita de Verdura","desc":"Canasta rellena de verduras frescas de estación.","price":2850,"cat":"Tartas y Salados","img":"img/canastita de verdura.JPG"},
    {"name":"Canastita de Humita","desc":"Canasta con relleno cremoso de humita casera.","price":2850,"cat":"Tartas y Salados","img":"img/canastita de humita.JPG"},
    {"name":"Empanada Árabe","desc":"Empanada de masa fina estilo árabe con carne especiada.","price":2850,"cat":"Tartas y Salados","img":"img/empanada arabe.JPG"},
    {"name":"Pastel de Papa","desc":"Pastel de papa gratinado con carne, en bandeja individual.","price":5700,"cat":"Tartas y Salados","img":"img/pastel de papa.JPG"},
    {"name":"Arrollado de Pollo","desc":"Arrollado de pollo con papa gratinado, listo para comer.","price":5700,"cat":"Tartas y Salados","img":"img/arrollado de pollo con papa.JPG"},
    {"name":"Pan Francés","desc":"Pan francés clásico, corteza dorada y miga esponjosa.","price":2550,"cat":"Panes","img":"img/pan frances.JPG"},
    {"name":"Pan Flauta","desc":"Baguette alargada con corteza crocante y miga aireada.","price":2550,"cat":"Panes","img":"img/pan flauta.JPG"},
    {"name":"Pan Mignón en Tira","desc":"Pancitos mignón ideales para picada o sándwich.","price":2550,"cat":"Panes","img":"img/pan mignion en tira.JPG"},
    {"name":"Pan de Campo","desc":"Pan rústico de campo con corteza dorada artesanal.","price":3800,"cat":"Panes","img":"img/pan de campo.JPG"},
    {"name":"Pan de Salvado","desc":"Pan integral de salvado, saludable y con mucha fibra.","price":3400,"cat":"Panes","img":"img/pan de salvado.JPG"},
    {"name":"Pan Lactal Multicereal","desc":"Pan lactal con semillas y cereales variados, rebanado.","price":4250,"cat":"Panes","img":"img/pan lactal multicereal .JPG"},
    {"name":"Pan de Masa Madre","desc":"Fermentación natural 24hs con semillas. Sabor intenso.","price":5500,"cat":"Panes","img":"img/pan de masa madre .JPG"},
    {"name":"Pan Masa Madre sin Semilla","desc":"Masa madre clásica, corteza crujiente, sin semillas.","price":5100,"cat":"Panes","img":"img/pan de masa madre sin semilla.JPG"},
    {"name":"Pan de Queso","desc":"Pan de queso artesanal, esponjoso y aromático.","price":4250,"cat":"Panes","img":"img/pan de queso.JPG"},
    {"name":"Figaza con Queso","desc":"Figaza artesanal con queso, ideal para acompañar.","price":3800,"cat":"Panes","img":"img/figaza con queso .JPG"},
    {"name":"Figaza de Manteca","desc":"Figaza alargada de manteca, suave y dorada.","price":3400,"cat":"Panes","img":"img/figaza de manteca alargada.JPG"},
    {"name":"Chapata","desc":"Chapata clásica italiana con corteza crujiente.","price":3000,"cat":"Panes","img":"img/chapata.JPG"},
    {"name":"Chapata Multicereal","desc":"Chapata con semillas de lino, girasol, sésamo y chía.","price":3400,"cat":"Panes","img":"img/chapata multicereal.JPG"},
]

ok = 0
fail = 0

for p in PRODUCTS:
    cat_id = CAT_MAP[p["cat"]]

    # Step 1: Create product without image
    data = {
        "name": {"es": p["name"]},
        "description": {"es": f"<p>{p['desc']}</p>"},
        "variants": [{"price": str(p["price"])}],
        "categories": [cat_id],
        "published": True
    }

    r = requests.post(f"{API}/products", headers=AUTH_HEADERS, json=data)

    if r.status_code not in (200, 201):
        fail += 1
        print(f"✗ {p['name']} — {r.status_code}: {r.text[:120]}")
        time.sleep(0.5)
        continue

    product_id = r.json()["id"]

    # Step 2: Upload image via multipart
    img_headers = {
        "Authentication": f"bearer {TOKEN}",
        "User-Agent": UA,
    }

    with open(p["img"], "rb") as f:
        files = {"filename": (p["name"] + ".jpg", f, "image/jpeg")}
        ri = requests.post(f"{API}/products/{product_id}/images", headers=img_headers, files=files)

    if ri.status_code in (200, 201):
        ok += 1
        print(f"✓ {p['name']} (ID: {product_id})")
    else:
        ok += 1  # product created, image failed
        print(f"~ {p['name']} (ID: {product_id}) — producto OK, imagen falló: {ri.status_code}")

    time.sleep(0.5)

print(f"\nResultado: {ok} productos creados, {fail} fallidos")
