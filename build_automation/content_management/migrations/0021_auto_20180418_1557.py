# Generated by Django 2.0.2 on 2018-04-18 22:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content_management', '0020_auto_20180418_1544'),
    ]

    operations = [
        migrations.AddField(
            model_name='content',
            name='copyright',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='content',
            name='rights_statement',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='content',
            name='source',
            field=models.CharField(max_length=2000, null=True),
        ),
    ]