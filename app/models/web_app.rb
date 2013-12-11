class WebApp < ActiveRecord::Base
	serialize :author_ids
  attr_accessible :name,:status,:version,:icon_path,:publish_path,:fav_count,:points,:add_count,:usage,:category_id,:scene_id,
  :project_id,:parent_id,:is_active,:author_ids,:description
end
