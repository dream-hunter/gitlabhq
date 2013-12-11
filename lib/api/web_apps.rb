module API
  # WebApps API
  class WebApps < Grape::API
    # before { authenticate! }

    resource :apps do
      # Get a apps list
      #
      # Example Request:
      #  GET /apps
      get do
        @apps = WebApp.all
        present @apps, with: Entities::WebApp
      end

      # Get a single app
      #
      # Parameters:
      #   id (required) - The ID of a app
      # Example Request:
      #   GET /apps/:id
      get ":id" do
        @app = WebApp.find(params[:id])
        present @app, with: Entities::WebApp
      end

      # Update app. Available only for admin
      #
      # Parameters:
      #   description                       - description
      #   name                              - Name
      #   points                            - points
      #   fav_count                         - fav_count
      #   download_count                    - download_count
      # Example Request:
      #   PUT /apps/:id
      put ":id" do
        attrs = attributes_for_keys [:description, :name, :points, :fav_count, :download_count]
        app = WebApp.find(params[:id])
        not_found!("WebApp not found") unless user

        if app.update_attributes(attrs, as: :admin)
          present app, with: Entities::WebApp
        else
          not_found!
        end
      end
    end
  end
end
