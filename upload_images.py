import requests, json, time, urllib.parse

API = "https://api.tiendanube.com/v1/7497005"
TOKEN = "259f205f9f430ecfd8e7cc9044ee5ca5e66117ac"
UA = "Mangini (manginiconfiterias@gmail.com)"
HEADERS = {
    "Authentication": f"bearer {TOKEN}",
    "User-Agent": UA,
    "Content-Type": "application/json"
}

GITHUB_RAW = "https://raw.githubusercontent.com/tinchocodep/mangini-web/main/"

PRODUCT_IMAGES = [
    (335076345, "img/MEDIALUNAS DULCES.JPG"),
    (335076351, "img/medialunas saladas.JPG"),
    (335076359, "img/FACTURAS SURTIDAS.JPG"),
    (335076364, "img/cremonas.JPG"),
    (335076369, "img/tortitas negras.JPG"),
    (335076375, "img/masitas.JPG"),
    (335076379, "img/Mini Alfajoreces de maicena.JPG"),
    (335076388, "img/PASTAFLORA DE BATATA.JPG"),
    (335076397, "img/torta mangini .JPG"),
    (335076402, "img/torta balcarce .JPG"),
    (335076411, "img/torta niza.JPG"),
    (335076419, "img/torta aconcagua.JPG"),
    (335076424, "img/tarta de puerro y jamon.JPG"),
    (335076430, "img/tarta de calabaza.JPG"),
    (335076437, "img/tarta calabaza y acelga.JPG"),
    (335076441, "img/tarta salada de queso .JPG"),
    (335076448, "img/canastita de jyq.JPG"),
    (335076454, "img/canastita de verdura.JPG"),
    (335076459, "img/canastita de humita.JPG"),
    (335076464, "img/empanada arabe.JPG"),
    (335076469, "img/pastel de papa.JPG"),
    (335076475, "img/arrollado de pollo con papa.JPG"),
    (335076479, "img/pan frances.JPG"),
    (335076483, "img/pan flauta.JPG"),
    (335076494, "img/pan mignion en tira.JPG"),
    (335076500, "img/pan de campo.JPG"),
    (335076506, "img/pan de salvado.JPG"),
    (335076512, "img/pan lactal multicereal .JPG"),
    (335076517, "img/pan de masa madre .JPG"),
    (335076523, "img/pan de masa madre sin semilla.JPG"),
    (335076529, "img/pan de queso.JPG"),
    (335076538, "img/figaza con queso .JPG"),
    (335076546, "img/figaza de manteca alargada.JPG"),
    (335076552, "img/chapata.JPG"),
    (335076559, "img/chapata multicereal.JPG"),
]

ok = 0
fail = 0

for product_id, img_path in PRODUCT_IMAGES:
    url = GITHUB_RAW + urllib.parse.quote(img_path)
    data = {"src": url}

    r = requests.post(f"{API}/products/{product_id}/images", headers=HEADERS, json=data)

    name = img_path.split("/")[-1].replace(".JPG", "")
    if r.status_code in (200, 201):
        ok += 1
        print(f"✓ {name}")
    else:
        fail += 1
        print(f"✗ {name} — {r.status_code}: {r.text[:120]}")

    time.sleep(0.5)

print(f"\nResultado: {ok} imágenes subidas, {fail} fallidas")
