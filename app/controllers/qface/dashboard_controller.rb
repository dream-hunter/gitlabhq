class Qface::DashboardController < ApplicationController
	layout false
	skip_before_filter :authenticate_user!
	
	def single_app
		# project = Project.find(params[:project_id]);
		# app = WebApp.where(:project_id => params[:project_id]).first
		render :json => {
			:username => current_user ? current_user.username : "guest",
			:logoname => "UTILHUB",
			:icons => {
				:type => "qface/system/desktop/scene/impl/icons/Scene",
				:theme => "Soria",
				:wallpaper => {
					:image => "res/wallpaper1.png",
					:color => "#696969",
					:style => "centered",
					:storedList => []
				},
				:apps => [{
					:sysname => "pst.sample.tool.Calculator.App",
					:name => "Calculator",
					:category => "Accessories",
					:icon => "icon-32-apps-accessories-calculator",
					:version => "1.0",
					:updated_at => "2013-09-01",
					:fav_count => "9"
				}]
			}
		}
	end
	
	def home
		render :json => {
			:username => current_user ? current_user.username : "guest",
			:logoname => "UTILHUB",
			:app => {
				:sysname => "pst.AppStore.AppStoreForHome",
				:name => "AppStore",
				:category => "System",
				:icon => "icon-32-apps-preferences-desktop-theme",
				:version => "1.0",
				:updated_at => "2013-10-11",
				:fav_count => "22",
				:args => {:loadCssPath => "../resources/stylesheets/appForHome.css"}
			}
		}
	end

	def desktop
		if current_user
			render :json => {
				:username => current_user.username,
				:userAvatar => current_user.avatar.url,
				:theme => "Soria",
				:logoname => "UTILHUB",
				:scenes => {
					:icons => {
						:type => "qface/system/desktop/scene/impl/icons/Scene",
						:theme => "Soria",
						:wallpaper => {
							:image => "res/wallpaper1.png",
							:color => "#696969",
							:style => "centered",
							:storedList => []
						},
						:panels => [{
							:thickness => 24,
							:span => 1,
							:locked => true,
							:orientation => "horizontal",
							:placement => "BC",
							:opacity => 0.95,
							:applets => [
								{
									:settings => {},
									:pos => 0.00,
									:declaredClass => "qface/system/desktop/scene/impl/icons/Fisheye"
								}
							]
						}],
						:apps => [
							{
								:sysname => "pst.sample.tool.Calculator.App",
								:name => "Calculator",
								:category => "Accessories",
								:icon => "icon-32-apps-accessories-calculator",
								:version => "1.0",
								:updated_at => "2013-09-01",
								:fav_count => "9"
							},
							{
								:sysname => "pst.sample.game.Checkers.App",
								:name => "Checkers",
								:category => "Games",
								:icon => "icon-32-apps-preferences-desktop-sound",
								:version => "1.0",
								:updated_at => "2013-10-01",
								:fav_count => "2"
							},
							{
								:sysname => "pst.sample.game.MineSweep.App",
								:name => "Mine Sweeping ",
								:category => "Games",
								:icon => "icon-32-apps-preferences-desktop-screensaver",
								:version => "1.0",
								:updated_at => "2013-10-01",
								:fav_count => "2"
							},
							{
								:sysname => "pst.sample.system.TaskManager.App",
								:name => "Task Manager",
								:category => "System",
								:icon => "icon-32-apps-utilities-system-monitor",
								:version => "1.0",
								:updated_at => "2013-10-01",
								:fav_count => "2"
							},
							{
								:sysname => "pst.sample.tool.WebBrowser.App",
								:name => "Web Browser",
								:category => "Internet",
								:icon => "icon-32-apps-internet-web-browser",
								:version => "1.0",
								:updated_at => "2013-10-11",
								:fav_count => "2"
							},
							{
								:sysname => "pst.sample.effect.3DVideo.App",
								:name => "3D Video",
								:category => "Multimedia",
								:icon => "icon-32-apps-internet-web-browser",
								:version => "1.0",
								:updated_at => "2013-10-03",
								:fav_count => "12"
							},
							{
								:sysname => "pst.sample.office.WordProcessor.App",
								:name => "Word Processor",
								:category => "Office",
								:icon => "icon-32-mimetypes-x-office-document",
								:version => "1.0",
								:updated_at => "2013-10-04",
								:fav_count => "25"
							},
							{
								:sysname => "pst.sample.mobile.JamlAppDemo.App",
								:name => "Jaml App Demo",
								:category => "mobile",
								:icon => "icon-32-apps-preferences-desktop-theme",
								:version => "1.0",
								:updated_at => "2013-10-21",
								:fav_count => "32"
							},
							{
								:sysname => "pst.AppStore.AppStore",
								:name => "AppStore",
								:category => "System",
								:icon => "icon-32-apps-preferences-desktop-theme",
								:version => "1.0",
								:updated_at => "2013-10-11",
								:fav_count => "22"
							}
						]
					}
				}
			}
		end
	end

	def link
		json_data = current_user ? get_link_json_data : {}
		get_sign_in_content(json_data)
		render :json => json_data
	end

	private 
	def get_link_json_data 
		{
			:actionZone	=> [
				{
					:name => "Projects",
					:href => "/dashboard/projects",
					:iconClass => "",
					:title => "Projects",
					:count => "",
					:class => "has_bottom_tooltip"
				},
				{
					:name => "Issues",
					:href => "/dashboard/issues",
					:iconClass => "",
					:title => "Issues",
					:count => "",
					:class => "has_bottom_tooltip"
				},
				{
					:name => "Requests",
					:href => "/dashboard/merge_requests",
					:iconClass => "",
					:title => "Merge Requests",
					:count => "",
					:class => "has_bottom_tooltip"
				},
				{
					:name => "Help",
					:href => "/help",
					:iconClass => "",
					:title => "Help",
					:class => "has_bottom_tooltip"
				}
			],
			:accountZone => [
				{
					:name => "Public",
					:iconClass => "icon-globe",
					:title => "Public Area",
					:href => "/public"
				},
				{
					:name => "My Snippets",
					:iconClass => "icon-paste",
					:title => "My snippets",
					:href => "/s/dream-hunter"
				},
				{
					:name => "Admin",
					:iconClass => "icon-cogs",
					:title => "Admin Area",
					:href => "/admin"
				},
				{
					:name => "New Project",
					:iconClass => "icon-plus",
					:title => "Create New Project",
					:href => "/projects/new"
				},
				{
					:name => "My Profile",
					:iconClass => "icon-user",
					:title => "My Profile",
					:href => "/profile"
				},
				{
					:name => "Logout",
					:iconClass => "icon-signout",
					:title => "Logout",
					:href => "/users/sign_out"
				}
			]
		}
	end

	def get_sign_in_content(json_data)
		if current_user
			json_data["signIn"] = [{
				:userAvatar => current_user.avatar.url,
				:name => current_user.username,
				:href => "/" + current_user.username + "/desktop",
				:iconClass => "",
				:title => current_user.username,
				:class => "has_bottom_tooltip"
			}]
		else
			json_data["signIn"] = [{
				:name => "Sign in",
				:href => "/users/sign_in",
				:iconClass => "",
				:title => "Sign in",
				:class => "has_bottom_tooltip"
			}]
		end 
	end
end
