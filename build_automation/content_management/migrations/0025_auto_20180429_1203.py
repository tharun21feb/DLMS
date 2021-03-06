# Generated by Django 2.0.2 on 2018-04-29 19:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content_management', '0024_auto_20180428_1833'),
    ]

    operations = [
        migrations.AlterField(
            model_name='directory',
            name='catalogers_need_all',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='directory',
            name='coverages_need_all',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='directory',
            name='creators_need_all',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='directory',
            name='keywords_need_all',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='directory',
            name='languages_need_all',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='directory',
            name='subjects_need_all',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='directory',
            name='workareas_need_all',
            field=models.BooleanField(default=False),
        ),
    ]
