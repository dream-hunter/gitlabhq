class WebApp < ActiveRecord::Base
	serialize :author_ids
  # attr_accessible :title, :body
end
