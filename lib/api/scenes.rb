module API
  # Scenes API
  class Scenes < Grape::API
    # before { authenticate! }

    resource :scenes do
      # Get a scene list
      #
      # Example Request:
      #  GET /scenes
      get do
        @scene = Scene.all
        present @scene, with: Entities::WebApp
      end

      # Get a single scene
      #
      # Parameters:
      #   id (required) - The ID of a scene
      # Example Request:
      #   GET /scenes/:id
      get ":id" do
        @scene = Scene.find(params[:id])
        present @scene, with: Entities::Scene
      end

      # Update scene. 
      #
      # Parameters:
      #   name                              - Name
      #   wallpaper                         - wallpaper
      #   theme                             - theme
      #   panels                            - panels
      #   app_ids                           - id of app which is added or deleted to scene
      #   app_method                        - the method of app -delete or add
      # Example Request:
      #   PUT /scenes/:id
      put ":id" do
        attrs = attributes_for_keys [:name, :wallpaper, :theme, :panels, :app_ids, :app_method]
        scene = Scene.find(params[:id])
        app_ids = attrs.delete(:app_ids)
        app_method = attrs.delete(:app_method)
        if(app_ids)
          app_ids.each do |aid|
            app = WebApp.find(aid)
            if(app_method == "delete")
              app.scene_id = nil
            else
              app.scene_id = params[:id]
            end
            app.save
          end
        else
          scene.update_attributes(attrs)
        end
        present scene, with: Entities::Scene
      end

      # Delete scene.
      #
      # Example Request:
      #   DELETE /scene/:id
      delete ":id" do
        scene = Scene.find_by_id(params[:id])

        if scene
          scene.destroy
        else
          not_found!
        end
      end
    end
  end
end
