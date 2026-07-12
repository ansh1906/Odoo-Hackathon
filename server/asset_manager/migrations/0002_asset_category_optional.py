# Generated manually to make asset categories optional during initial setup.

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("asset_manager", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="asset",
            name="category",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                to="orgstructure.assetcategory",
            ),
        ),
    ]
