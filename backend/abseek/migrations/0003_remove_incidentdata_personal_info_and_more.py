# Generated by Django 5.2.1 on 2025-05-19 05:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('abseek', '0002_remove_patient_personal_info_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='incidentdata',
            name='personal_info',
        ),
        migrations.RemoveField(
            model_name='patientdata',
            name='personal_info',
        ),
        migrations.AlterField(
            model_name='incidentdata',
            name='bite_site',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='incidentdata',
            name='case_id',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='incidentdata',
            name='location',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='incidentdata',
            name='species',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='patientdata',
            name='patient_id',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='patientdata',
            name='vaccination_status',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='personalinfo',
            name='address',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='personalinfo',
            name='age',
            field=models.PositiveIntegerField(),
        ),
        migrations.AlterField(
            model_name='personalinfo',
            name='emergency_contact',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='personalinfo',
            name='full_name',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='personalinfo',
            name='gender',
            field=models.CharField(max_length=50),
        ),
    ]
