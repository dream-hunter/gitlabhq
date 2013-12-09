class CreateWebApps < ActiveRecord::Migration
  def change
    create_table :web_apps do |t|
      t.string :name, null: false
      t.string :status
      t.string :version
      t.string :icon_path
      t.string :publish_path
      t.integer :fav_count
      t.integer :points
      t.integer :add_count
      t.integer :usage
      t.integer :category_id
      t.integer :scene_id
      t.integer :project_id
      t.integer :parent_id
      t.boolean :is_active,default: true
      t.text :author_ids
      t.text :description
      t.timestamps
    end
    add_index :web_apps, :name
    add_index :web_apps, :scene_id
    add_index :web_apps, :is_active
    add_index :web_apps, :usage
    add_index :web_apps, :category_id
    add_index :web_apps, :add_count
    add_index :web_apps, :points
    add_index :web_apps, :fav_count
  end
end
