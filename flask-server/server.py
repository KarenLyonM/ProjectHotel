from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def format_occupancy_code(occupancy_code):
    parts = occupancy_code.split('-')
    adult_count = int(parts[0])
    child_count = int(parts[1])
    baby_count = int(parts[2])
    
    adult_label = f"{adult_count} adulto{'s' if adult_count != 1 else ''}"
    child_label = f"{child_count} niño{'s' if child_count != 1 else ''}"
    baby_label = f"{baby_count} bebé{'s' if baby_count != 1 else ''}"
    
    return f"{adult_label}, {child_label}, {baby_label}"

room_list = [
    {
        'room_key': 1,
        'room_name': 'Habitación doble Vista Jardín',
        'room_description': 'Dos camas individuales, suelos de madera, balcón con vistas, plato de ducha, accesorios de baño, WiFi, secador de pelo, TV 32’’, calefacción, aire acondicionado, caja fuerte y mini bar con coste adicional.',
        'room_picture': 'hab_vista_jardin.png',
        'available_occupancy': ['1-0-0', '1-1-0', '2-0-0'],
        'data_prices': [
            [{'target_occupancy': ['1-0-0'], 'rate_id': 'NRF', 'rate_name': 'Tarifa No Reembolsable', 'price': 200.00 }, {'rate_id': 'FLEX', 'rate_name': 'Tarifa Flexible', 'price': 250.00 }],
            [{'target_occupancy': ['1-1-0', '2-0-0'], 'rate_id': 'NRF', 'rate_name': 'Tarifa No Reembolsable', 'price': 300.00 }, {'rate_id': 'FLEX', 'rate_name': 'Tarifa Flexible', 'price': 350.00 }]
        ]
    }, 
    {
        'room_key': 2,
        'room_name': 'Habitación doble Vista Mar',
        'room_description': 'Maravillosas vistas al mar mediterráneo. Habitación con suelos de madera, plato de ducha, jacuzzi hidromasaje, amenities y secador de pelo. WiFi, TV 42’, calefacción, aire acondicionado, caja fuerte y mini bar sin coste adicional.',
        'room_picture':  'hab_vista_mar.png',
        'available_occupancy': ['1-0-0','2-0-0'],
        'data_prices': [
            [{'target_occupancy': ['1-0-0'], 'rate_id': 'NRF', 'rate_name': 'Tarifa No Reembolsable', 'price': 400.00 }, {'rate_id': 'FLEX', 'rate_name': 'Tarifa Flexible', 'price': 450.00 }],
            [{'target_occupancy': ['2-0-0'], 'rate_id': 'NRF', 'rate_name': 'Tarifa No Reembolsable', 'price': 550.00 }, {'rate_id': 'FLEX', 'rate_name': 'Tarifa Flexible', 'price': 600.00 }]
        ]
    }
]

@app.route("/rooms")
def get_rooms():
    rooms_data = []
    for room in room_list:
        min_price = min([price_info['price'] for price_list in room['data_prices'] for price_info in price_list])
        rooms_data.append({
            'room_key': room['room_key'],
            'room_name': room['room_name'],
            'room_description': room['room_description'],
            'room_picture': room['room_picture'],
            'price': min_price 
        })
    return jsonify(rooms_data)


@app.route("/room/detail/<int:room_key>")
def get_room_detail(room_key):
    room_detail = None
    for room in room_list:
        if room['room_key'] == room_key:
            formatted_prices = []
            for price_list in room['data_prices']:
                formatted_price = []
                for price in price_list:
                    if 'target_occupancy' in price:
                        formatted_price.append({
                            'target_occupancy': [format_occupancy_code(code) for code in price['target_occupancy']],
                            'rate_id': price['rate_id'],
                            'rate_name': price['rate_name'],
                            'price': price['price']
                        })
                    else:
                        formatted_price.append({
                            'rate_id': price['rate_id'],
                            'rate_name': price['rate_name'],
                            'price': price['price']
                        })
                formatted_prices.append(formatted_price)
                
            room_detail = {
                'room_key': room['room_key'],
                'room_name': room['room_name'],
                'room_description': room['room_description'],
                'room_picture': room['room_picture'],
                'prices': formatted_prices
            }
            break
    
    if room_detail is None:
        return jsonify({'error': 'Habitación no encontrada'}), 404
    
    return jsonify(room_detail)

@app.route("/search")
def search_rooms():
    adults = int(request.args.get('adults', 1))
    children = int(request.args.get('children', 0))
    babies = int(request.args.get('babies', 0))
    price = request.args.get('price')
    
    if price is None or price == '':
        price = float('inf')
    else:
        price = float(price)  
    
    filtered_rooms = []
    for room in room_list:
        for occupancy in room['available_occupancy']:
            adult_count, child_count, baby_count = map(int, occupancy.split('-'))
            if adult_count >= adults and child_count >= children and baby_count >= babies:
                for price_list in room['data_prices']:
                    for price_info in price_list:
                        if price_info['price'] <= price:
                            for rate_info in price_list: 
                                filtered_rooms.append({
                                    'room_key': room['room_key'],
                                    'room_name': room['room_name'],
                                    'room_description': room['room_description'],
                                    'room_picture': room['room_picture'],
                                    'rate_id': rate_info['rate_id'], 
                                    'rate_name': rate_info['rate_name'],  
                                    'price': price_info['price']
                                })
                            break  
    if not adults and not children and not babies and not price:
        all_rooms = []
        for room in room_list:
            for price_list in room['data_prices']:
                for price_info in price_list:
                    for rate_info in price_list:
                        all_rooms.append({
                            'room_key': room['room_key'],
                            'room_name': room['room_name'],
                            'room_description': room['room_description'],
                            'room_picture': room['room_picture'],
                            'rate_id': rate_info['rate_id'], 
                            'rate_name': rate_info['rate_name'], 
                            'price': price_info['price']
                        })
        return jsonify(all_rooms)
    
    return jsonify(filtered_rooms)


if __name__ == "__main__":
    app.run(debug=True)
