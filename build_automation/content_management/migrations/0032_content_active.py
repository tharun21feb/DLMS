# Generated by Django 2.1.3 on 2019-12-20 20:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content_management', '0031_metadatasheet_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='content',
            name='active',
            field=models.BooleanField(default=True),
        ),
    ]
