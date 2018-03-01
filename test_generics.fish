for p in "log" "watchers"
	for r in "/" "/last" "/length" "/last/10" "/10" "/0/10"
		echo http://monitor.adebray.ovh/$p$r
		curl -i --request GET \
		  --url http://monitor.adebray.ovh/$p$r \
		  --header 'authorization: Basic bmdpbng6YXNkemVmYXN4emRjMTIz' \
		  --header 'content-type: text/plain' \
		  --data adhuiadh
		echo ""
	end
end
