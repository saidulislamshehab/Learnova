<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
use Illuminate\Support\Facades\DB;

$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$tableName = 'experts';
$results = DB::select("
    SELECT 
        tp.name AS table_name,
        fk.name AS constraint_name,
        tr.name AS referenced_table_name
    FROM sys.foreign_keys AS fk
    INNER JOIN sys.tables AS tp ON fk.parent_object_id = tp.object_id
    INNER JOIN sys.tables AS tr ON fk.referenced_object_id = tr.object_id
    WHERE tr.name = ?
", [$tableName]);

echo "Foreign keys pointing to '$tableName':\n";
foreach ($results as $row) {
    echo "Table: " . $row->table_name . " | Constraint: " . $row->constraint_name . "\n";
}
