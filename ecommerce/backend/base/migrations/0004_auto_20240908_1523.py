from django.db import migrations

def populate_categories(apps, schema_editor):
    Category = apps.get_model('base', 'Category')
    Product = apps.get_model('base', 'Product')
    
    # Add unique categories from existing product data
    categories = Product.objects.values_list('category', flat=True).distinct()
    for category_name in categories:
        if category_name:
            Category.objects.create(name=category_name)

class Migration(migrations.Migration):

    dependencies = [
        ('base', '000X_previous_migration'),
    ]

    operations = [
        migrations.RunPython(populate_categories),
    ]
