class AddIsAppToProjects < ActiveRecord::Migration
  def change
  	add_column :projects, :is_app, :boolean
    add_index :projects, :is_app
  end
end
