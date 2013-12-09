class CreateScenes < ActiveRecord::Migration
  def change
    create_table :scenes do |t|
      t.string :name
      t.string :type
      t.string :theme
      t.string :wallpaper
      t.text :panels
      t.integer :owner_id
      t.integer :group_id
      t.integer :usage
      t.timestamps
    end

    add_index :scenes, :name
    add_index :scenes, :owner_id
    add_index :scenes, :usage
  end
end
