import os
import json
from flask import Flask, render_template, request, jsonify, session, redirect

app = Flask(__name__)
app.secret_key = "jugendstil_secret_key_1900_secession"

# Системные пути к JSON-файлам базы данных
PRODUCTS_FILE = os.path.join(os.path.dirname(__file__), 'products.json')
USERS_FILE = os.path.join(os.path.dirname(__file__), 'users.json')
ORDERS_FILE = os.path.join(os.path.dirname(__file__), 'orders.json')

# Инициализация пустых файлов баз данных, если они отсутствуют на диске
def init_db_files():
    if not os.path.exists(PRODUCTS_FILE):
        with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f, ensure_ascii=False, indent=2)
    if not os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f, ensure_ascii=False, indent=2)
    if not os.path.exists(ORDERS_FILE):
        with open(ORDERS_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f, ensure_ascii=False, indent=2)

init_db_files()

# Вспомогательные функции для чтения и записи JSON данных
def read_json(path):
    try:
        # Получаем полный путь к файлу
        full_path = os.path.join(os.path.dirname(__file__), path)
        print(f"🔍 Читаю: {full_path}")
        
        with open(full_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            print(f"✅ Загружено {len(data)} записей")
            return data
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        return []

def write_json(path, data):
    try:
        full_path = os.path.join(os.path.dirname(__file__), path)
        with open(full_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"✅ Сохранено {len(data)} записей")
    except Exception as e:
        print(f"❌ Ошибка записи: {e}")

# =========================================================================
# 1. СТАРТОВЫЕ ЭКРАНЫ ПРИВЕТСТВИЯ И ВХОД АДМИНИСТРАТОРА
# =========================================================================

@app.route('/')
def index():
    return redirect('/welcome/user')

@app.route('/welcome/user')
def welcome_user():
    return render_template('user_welcome.html')

@app.route('/welcome/admin')
def welcome_admin():
    if session.get('role') != 'admin':
        return redirect('/login')
    return render_template('admin_welcome.html')

@app.route('/login')
def admin_login_page():
    if session.get('role') == 'admin':
        return redirect('/welcome/admin')
    return render_template('login.html')

@app.route('/api/auth/login', methods=['POST'])
def api_auth_login():
    if request.is_json:
        data = request.get_json() or {}
        username = data.get('username', '').strip()
        password = data.get('password', '')
    else:
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')
    
    print(f"🔐 Попытка входа: логин='{username}', пароль='{password}'")
    
    if not username or not password:
        if request.is_json:
            return jsonify({"success": False, "message": "Заполните все поля!"})
        return "Заполните все поля!", 400
    
    users = read_json(USERS_FILE)
    print(f"📁 Найдено пользователей: {len(users)}")
    
    # Ищем пользователя
    for u in users:
        if not isinstance(u, dict):
            continue
        if u.get('login', '').strip().lower() == username.lower() and u.get('password') == password:
            print(f"✅ Найден пользователь: {u.get('login')} с ролью {u.get('role')}")
            
            # СОХРАНЯЕМ РОЛЬ ИЗ БАЗЫ ДАННЫХ!
            session['user'] = u.get('fio', username)
            session['login'] = u.get('login')
            session['role'] = u.get('role', 'user')  # <-- БЕРЁМ РОЛЬ ИЗ БАЗЫ!
            session['phone'] = u.get('phone', '')
            session['user_id'] = u.get('id')
            
            print(f"📝 Сессия создана: role={session.get('role')}")
            
            # Перенаправляем в зависимости от роли
            if session['role'] == 'admin':
                print("➡️ Редирект на /welcome/admin")
                if request.is_json:
                    return jsonify({"success": True, "redirect": "/welcome/admin"})
                return redirect('/welcome/admin')
            else:
                print("➡️ Редирект на /user/profile")
                if request.is_json:
                    return jsonify({"success": True, "redirect": "/user/profile"})
                return redirect('/user/profile')
    
    print("❌ Пользователь не найден")
    if request.is_json:
        return jsonify({"success": False, "message": "Неверный логин или пароль!"})
    return "Неверный логин или пароль!", 400
@app.route('/logout')
def logout_action():
    session.clear()
    return redirect('/user/profile')

# =========================================================================
# 2. ИНТЕРФЕЙСЫ ПОКУПАТЕЛЯ И НАВИГАЦИОННАЯ ЦЕПОЧКА ПРОФИЛЯ
# =========================================================================

@app.route('/user/catalog')
def user_catalog():
    if not session.get('user'):
        session['user'] = 'Гость'
        session['role'] = 'user'
    return render_template('pages/user_catalog.html')

@app.route('/shop/cart')
def user_cart_page():
    return render_template('pages/user_cart.html')

@app.route('/profile_login', methods=['POST'])
def profile_login_verify_data():
    input_login = request.form.get('login', '').strip()
    input_password = request.form.get('password', '')
    
    if not input_login or not input_password:
        return "Пожалуйста, вернитесь назад и заполните все поля!", 400
        
    users = read_json(USERS_FILE)
    if not isinstance(users, list): 
        users = []
        
    for u in users:
        db_login = u.get('login', '').strip()
        db_password = u.get('password', '')
        
        if db_login.lower() == input_login.lower() and str(db_password) == str(input_password):
            session['user'] = u.get('login')
            session['fio'] = u.get('fio', 'Уважаемый покупатель')
            session['phone'] = u.get('phone', '')
            session['role'] = 'user'
            session['user_id'] = u.get('id')
            return redirect('/user/profile')
            
    return "Неверный логин или пароль! Вернитесь назад и попробуйте снова.", 400

@app.route('/user/profile/login', methods=['GET'])
def old_login_link_safeguard():
    return redirect('/profile_login')

@app.route('/user/profile', methods=['GET'])
def user_profile_choice_page():
    if session.get('role') == 'user':
        return render_template('pages/user_profile.html')
    return render_template('pages/profile_choice.html')

@app.route('/user/profile/register')
def user_profile_register():
    if session.get('user') and session.get('user') != 'Гость':
        return redirect('/user/profile')
    return render_template('profile_register.html')

@app.route('/zakaz')
def order_checkout_page():
    if not session.get('user') or session.get('user') == 'Гость':
        return redirect('/user/profile')
    return render_template('profile_zakaz.html')

# =========================================================================
# 3. ИНТЕРФЕЙСЫ АДМИНИСТРАТОРА
# =========================================================================

@app.route('/admin/catalog')
def admin_catalog_page():
    if session.get('role') != 'admin':
        return redirect('/login')
    return render_template('pages/admin_catalog.html')  # <-- ПРАВИЛЬНО!

@app.route('/admin/orders')
def smart_routing_orders_page():
    if not session.get('user') or session.get('user') == 'Гость':
        return redirect('/user/profile')
    return render_template('pages/admin_orders.html')

# =========================================================================
# 4. ВНУТРЕННИЕ API ЭНДПОИНТЫ
# =========================================================================

@app.route('/api/user/register', methods=['POST'])
def api_user_register():
    data = request.get_json() or {}
    last_name = data.get('lastName', '').strip()
    first_name = data.get('firstName', '').strip()
    middle_name = data.get('middleName', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '')
    phone = data.get('phone', '').strip()

    if not email or not password:
        return jsonify({"success": False, "message": "Логин и пароль обязательны для заполнения!"})

    loaded_users = read_json(USERS_FILE)
    if not isinstance(loaded_users, list):
        users = []
    else:
        users = loaded_users
    
    for u in users:
        if not isinstance(u, dict):
            continue
        if u.get('email', '').lower() == email.lower():
            return jsonify({"success": False, "message": "Покупатель с таким логином уже зарегистрирован!"})

    fio_full = f"{last_name} {first_name} {middle_name}".strip()
    if not fio_full:
        fio_full = email

    max_id = 5001
    for u in users:
        if isinstance(u, dict) and u.get('id', 0) > max_id:
            max_id = u.get('id', 0)
    
    new_user = {
        "id": max_id + 1,
        "fio": fio_full,
        "email": email,
        "login": email,
        "password": password,
        "phone": phone,
        "role": "user"
    }
    
    users.append(new_user)
    write_json(USERS_FILE, users)
    return jsonify({"success": True, "message": "Учетная запись успешно создана в реестре!"})

@app.route('/api/user/login', methods=['POST'])
def api_user_login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    users = read_json(USERS_FILE)
    for u in users:
        if not isinstance(u, dict):
            continue
            
        if u.get('email', '').lower() == email and u.get('password') == password:
            session['user'] = u.get('email')
            session['role'] = 'user'
            session['fio'] = u.get('fio', u.get('email'))
            session['phone'] = u.get('phone', 'Не указан')
            session['user_id'] = u.get('id')
            return jsonify({"success": True})
            
    return jsonify({"success": False, "message": "Неверный логин или пароль покупателя!"})

@app.route('/api/products', methods=['GET', 'POST'])
def api_products_handler():
    if request.method == 'GET':
        return jsonify(read_json(PRODUCTS_FILE))
        
    if session.get('role') != 'admin':
        return jsonify({"success": False, "message": "Отказ в доступе"}), 403
        
    products = read_json(PRODUCTS_FILE)
    new_id = max([p.get('id', 0) for p in products]) + 1 if products else 1
    
    new_item = {
        "id": new_id,
        "title": request.form.get('title', 'Без названия'),
        "category": request.form.get('category', 'Разное'),
        "color": request.form.get('color', 'Орех'),
        "price": int(request.form.get('price', 0)),
        "description": request.form.get('description', ''),
        "image": "default.jpg"
    }
    
    if 'image' in request.files:
        file = request.files['image']
        if file and file.filename:
            file.save(os.path.join(os.path.dirname(__file__), 'static', 'uploads', file.filename))
            new_item['image'] = file.filename

    products.append(new_item)
    write_json(PRODUCTS_FILE, products)
    return redirect('/admin/catalog')

@app.route('/api/products/delete/<int:product_id>', methods=['DELETE'])
def api_products_delete(product_id):
    if session.get('role') != 'admin':
        return jsonify({"success": False, "message": "Отказ в доступе"}), 403
    products = read_json(PRODUCTS_FILE)
    products = [p for p in products if p.get('id') != product_id]
    write_json(PRODUCTS_FILE, products)
    return jsonify({"success": True})

@app.route('/api/orders', methods=['GET'])
def api_orders_get():
    return jsonify(read_json(ORDERS_FILE))

# =========================================================================
# ВСЕЯДНЫЙ АДРЕС ПРИЕМА ЗАКАЗА
# =========================================================================
@app.route('/save-order', methods=['POST'])
def api_save_new_order_monolith_final():
    data = request.get_json() or {}
    address = data.get('address', '').strip()
    cart_items = data.get('items', [])
    total_price = data.get('total', 0)
    
    if not address or not cart_items:
        return jsonify({"success": False, "message": "Заполните адрес и выберите товары!"})

    loaded_orders = read_json(ORDERS_FILE)
    orders = loaded_orders if isinstance(loaded_orders, list) else []

    customer_fio = session.get('fio', session.get('user', 'Анонимный клиент'))
    order_number = len(orders) + 1
    items_summary = [f"{item['title']} ({item['quantity']} шт.)" for item in cart_items]

    new_order = {
        "id": order_number,
        "customer": customer_fio,
        "items": items_summary,
        "total": total_price,
        "address": address
    }
    
    orders.append(new_order)
    write_json(ORDERS_FILE, orders)
    return jsonify({"success": True})

# =========================================================================
# API УДАЛЕНИЯ ЗАКАЗА
# =========================================================================
@app.route('/api/orders/delete/<int:order_id>', methods=['DELETE'])
def api_delete_order(order_id):
    if not session.get('user') or session.get('user') == 'Гость':
        return jsonify({"success": False, "message": "Отказ в доступе"}), 403

    orders = read_json(ORDERS_FILE)
    updated_orders = [o for o in orders if o.get('id') != order_id]
    write_json(ORDERS_FILE, updated_orders)
    return jsonify({"success": True, "message": "Заказ успешно отменен"})

# =========================================================================
# ПРИЕМ ДАННЫХ ДЛЯ РОУТА PROFILE_REGISTER
# =========================================================================
@app.route('/profile_register', methods=['POST'])
def profile_register_save_data():
    last_name = request.form.get('last_name', '').strip()
    first_name = request.form.get('first_name', '').strip()
    middle_name = request.form.get('middle_name', '').strip()
    login = request.form.get('login', '').strip()
    password = request.form.get('password', '')
    phone = request.form.get('phone', '').strip()
    
    if not last_name or not first_name or not login or not password or not phone:
        return "Пожалуйста, вернитесь назад и заполните все обязательные поля!", 400
        
    loaded_users = read_json(USERS_FILE)
    users = loaded_users if isinstance(loaded_users, list) else []
    
    for u in users:
        if u.get('login', '').lower() == login.lower():
            return "Этот логин уже занят! Вернитесь назад и попробуйте другой.", 400
    
    max_id = 5001
    for u in users:
        if isinstance(u, dict) and u.get('id', 0) > max_id:
            max_id = u.get('id', 0)
            
    new_id = max_id + 1
    
    new_user = {
        "id": new_id,
        "fio": f"{last_name} {first_name} {middle_name}".strip(),
        "login": login,
        "password": password,
        "phone": phone,
        "role": "user"
    }
    
    users.append(new_user)
    write_json(USERS_FILE, users)
    
    return '''
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body>
            <script>
                alert("РЕГИСТРАЦИЯ УСПЕШНО ЗАВЕРШЕНА!");
                window.location.href = "/user/profile";
            </script>
        </body>
        </html>
    '''

@app.route('/user/profile/login')
def old_login_route_redirect():
    return redirect('/profile_login')

@app.route('/profile_login', methods=['GET'])
def profile_login_page():
    if session.get('role') == 'user':
        return redirect('/user/profile')
    return render_template('profile_login.html')

@app.route('/api/admin/login', methods=['POST'])
def api_admin_login():
    data = request.get_json() or {}
    username = data.get('username', '').strip()
    password = data.get('password', '')
    
    print(f"🔐 Вход: {username} / {password}")
    
    # ЖЕСТКАЯ ПРОВЕРКА
    if username == "admin" and password == "123":
        session['user'] = "Мастер Салона"
        session['login'] = "admin"
        session['role'] = "admin"
        session['phone'] = "+7 (999) 999-99-99"
        session['user_id'] = 1
        
        print(f"✅ АДМИН ВОШЕЛ!")
        return jsonify({"success": True, "redirect": "/admin/welcome"})
    
    print("❌ Неверный логин или пароль")
    return jsonify({"success": False, "message": "Неверный логин или пароль!"}) 

@app.route('/api/auth/status')
def auth_status():
    return jsonify({
        'is_admin': session.get('role') == 'admin',
        'is_authenticated': bool(session.get('user')),
        'role': session.get('role', 'guest')
    })
@app.route('/admin/dashboard')
def admin_dashboard():
    if session.get('role') != 'admin':
        return redirect('/login')
    return render_template('pages/admin_dashboard.html')

# =========================================================================
# АДМИН - РЕДАКТИРОВАНИЕ ТОВАРА
# =========================================================================

# GET - показать форму редактирования
@app.route('/admin/ismena/<int:product_id>', methods=['GET'])
def admin_ismena_page(product_id):
    if session.get('role') != 'admin':
        return redirect('/login')
    
    products = read_json(PRODUCTS_FILE)
    product = None
    for p in products:
        if p.get('id') == product_id:
            product = p
            break
    
    if not product:
        return "Товар не найден", 404
    
    return render_template('pages/admin_ismena.html', product=product)

# POST - сохранить изменения
@app.route('/admin/ismena/<int:product_id>', methods=['POST'])
def admin_ismena_save(product_id):
    if session.get('role') != 'admin':
        return redirect('/login')
    
    title = request.form.get('title', '').strip()
    category = request.form.get('category', '').strip()
    color = request.form.get('color', '').strip()
    price = int(request.form.get('price', 0))
    description = request.form.get('description', '').strip()
    
    products = read_json(PRODUCTS_FILE)
    
    for p in products:
        if p.get('id') == product_id:
            p['title'] = title
            p['category'] = category
            p['color'] = color
            p['price'] = price
            p['description'] = description
            
            if 'image' in request.files:
                file = request.files['image']
                if file and file.filename:
                    filename = file.filename
                    file.save(os.path.join(os.path.dirname(__file__), 'static', 'uploads', filename))
                    p['image'] = filename
            break
    
    write_json(PRODUCTS_FILE, products)
    return redirect('/admin/dashboard')  

# =========================================================================
# АДМИН - ДОБАВЛЕНИЕ ТОВАРА
# =========================================================================

@app.route('/admin/add-product', methods=['GET'])
def admin_add_product_page():
    if session.get('role') != 'admin':
        return redirect('/login')
    return render_template('pages/admin_add.html')

@app.route('/admin/add-product', methods=['POST'])
def admin_add_product_save():
    if session.get('role') != 'admin':
        return redirect('/login')
    
    title = request.form.get('title', '').strip()
    category = request.form.get('category', '').strip()
    color = request.form.get('color', '').strip()
    price = int(request.form.get('price', 0))
    description = request.form.get('description', '').strip()
    
    # Загружаем товары
    products = read_json(PRODUCTS_FILE)
    
    # Новый ID
    new_id = max([p.get('id', 0) for p in products]) + 1 if products else 1
    
    # Обработка изображения
    filename = 'default.jpg'
    if 'image' in request.files:
        file = request.files['image']
        if file and file.filename:
            filename = file.filename
            file.save(os.path.join(os.path.dirname(__file__), 'static', 'uploads', filename))
    
    new_item = {
        "id": new_id,
        "title": title,
        "category": category,
        "color": color,
        "price": price,
        "description": description,
        "image": filename
    }
    
    products.append(new_item)
    write_json(PRODUCTS_FILE, products)
    
    return redirect('/admin/dashboard')

if __name__ == '__main__':
    app.run(debug=True, port=5000)