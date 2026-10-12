# Mi-PokeAPI

API minimalista de los primeros 151 Pokémon (Generación 1) con Flask + página web comparativa.

## Instalación

```bash
cd Mi-PokeAPI
python -m venv .venv
# Windows: .\.venv\Scripts\activate
# Linux/Mac: source .venv/bin/activate
pip install -r requirements.txts
```

## Ejecución

```bash
python app.py
# o: flask --app app run --port 5000
```

Abrir http://localhost:5000

## Uso

- API: GET /pokemon/<nombre_o_id> (case-insensitive, guiones->espacios, sin símbolos/espacios)
- Web: split view PokeAPI vs Mi-PokeAPI con tarjeta + JSON completo

## Notas
- Imágenes Mi-PokeAPI: images/id.png
- Logos: web/images/mi-pokeapi-logo.png, web/images/pokeapi-logo.png
- Sin base de datos
